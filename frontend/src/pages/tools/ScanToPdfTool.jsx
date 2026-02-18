import React, { useState, useRef, useEffect } from "react";

const API_BASE = "http://localhost:8000";

export default function ScanToPdfTool() {
    const [images, setImages] = useState([]); // Array of Blob objects
    const [imageUrls, setImageUrls] = useState([]); // Array of preview URLs
    const [outputName, setOutputName] = useState("scanned_document");
    const [loading, setLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState("");

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        try {
            setError("");
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" } // Prefer back camera on mobile
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setCameraActive(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure you have granted permission.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCameraActive(false);
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to Blob
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                setImages(prev => [...prev, blob]);
                setImageUrls(prev => [...prev, url]);
            }
        }, "image/jpeg", 0.95);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        const newUrls = [...imageUrls];

        // Revoke URL to avoid memory leaks
        URL.revokeObjectURL(newUrls[index]);

        newImages.splice(index, 1);
        newUrls.splice(index, 1);

        setImages(newImages);
        setImageUrls(newUrls);
    };

    const handleSubmit = async () => {
        if (images.length === 0) return alert("Capture at least one image!");

        try {
            setLoading(true);
            const fd = new FormData();
            images.forEach((blob, i) => {
                // Name files sequentially so they are ordered correctly by backend if it relies on name,
                // though usually FormData order is preserved or we can use specific naming convention.
                fd.append("files", blob, `scan_${i + 1}.jpg`);
            });

            const res = await fetch(`${API_BASE}/api/image-to-pdf/`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Conversion failed");
            }

            const resultBlob = await res.blob();
            const url = window.URL.createObjectURL(resultBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (outputName || "scanned") + ".pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to create PDF from scans.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolCard" style={{ marginTop: 24 }}>
            <h3>Scan to PDF</h3>
            <p className="tool-desc">Use your camera to scan documents and check them into a PDF.</p>

            {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

            {/* Camera View */}
            <div style={{ marginBottom: 20, textAlign: "center" }}>
                {!cameraActive ? (
                    <button
                        onClick={startCamera}
                        style={{
                            padding: "10px 20px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            marginBottom: 10
                        }}
                    >
                        Start Camera
                    </button>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "500px",
                            background: "#000",
                            borderRadius: 8,
                            overflow: "hidden"
                        }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                style={{ width: "100%", display: "block" }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                onClick={captureImage}
                                style={{
                                    padding: "10px 20px",
                                    background: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer"
                                }}
                            >
                                Capture
                            </button>
                            <button
                                onClick={stopCamera}
                                style={{
                                    padding: "10px 20px",
                                    background: "#dc2626",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer"
                                }}
                            >
                                Stop Camera
                            </button>
                        </div>
                    </div>
                )}
                {/* Hidden canvas for capturing */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            {/* Captured Images List */}
            {imageUrls.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <h4>Captured Pages ({imageUrls.length})</h4>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        marginTop: 10,
                        justifyContent: "center"
                    }}>
                        {imageUrls.map((url, idx) => (
                            <div key={idx} style={{ position: "relative", width: 100 }}>
                                <img
                                    src={url}
                                    alt={`Scan ${idx + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "140px",
                                        objectFit: "cover",
                                        borderRadius: 4,
                                        border: "1px solid #ddd"
                                    }}
                                />
                                <button
                                    onClick={() => removeImage(idx)}
                                    style={{
                                        position: "absolute",
                                        top: -5,
                                        right: -5,
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 20,
                                        height: 20,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 12
                                    }}
                                >
                                    ×
                                </button>
                                <div style={{ textAlign: "center", fontSize: 12, marginTop: 2 }}>
                                    Page {idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Controls */}
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 5 }}>Output Filename:</label>
                <input
                    type="text"
                    value={outputName}
                    onChange={(e) => setOutputName(e.target.value)}
                    placeholder="Enter output filename"
                    style={{ padding: 8, width: "100%", borderRadius: 5, border: "1px solid #ccc" }}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || images.length === 0}
                style={{
                    padding: "12px 24px",
                    background: loading || images.length === 0 ? "#ccc" : "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: loading || images.length === 0 ? "not-allowed" : "pointer",
                    width: "100%",
                    fontSize: 16
                }}
            >
                {loading ? "Converting..." : "Convert Scanned Pages to PDF"}
            </button>
        </div>
    );
}
