import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

export default function SignPdfTool() {
    const [pdfFile, setPdfFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [outputName, setOutputName] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [xCoord, setXCoord] = useState(100);
    const [yCoord, setYCoord] = useState(100);

    const handlePdfChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
            if (!outputName) {
                setOutputName(e.target.files[0].name.replace(/\.pdf$/i, "") + "_signed");
            }
        }
    };

    const handleSignatureChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSignatureFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!pdfFile) return alert("Please select a PDF file!");
        if (!signatureFile) return alert("Please select a signature image!");

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("file", pdfFile);
            fd.append("signature", signatureFile);
            fd.append("page", pageNumber);
            fd.append("x", xCoord);
            fd.append("y", yCoord);

            const res = await fetch(`${API_BASE}/api/sign-pdf/`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Signing failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (outputName || "signed") + ".pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to sign PDF: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolCard" style={{ marginTop: 24 }}>
            <h3>Sign PDF</h3>
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 5 }}>Upload PDF:</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 5 }}>Upload Signature (PNG/JPG):</label>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleSignatureChange}
                />
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: 16 }}>
                <div>
                    <label style={{ fontSize: 14, display: "block" }}>Page Number:</label>
                    <input
                        type="number"
                        min="1"
                        value={pageNumber}
                        onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
                        style={{ width: "80px", padding: 5 }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: 14, display: "block" }}>X (pts):</label>
                    <input
                        type="number"
                        min="0"
                        value={xCoord}
                        onChange={(e) => setXCoord(parseInt(e.target.value) || 0)}
                        style={{ width: "80px", padding: 5 }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: 14, display: "block" }}>Y (pts):</label>
                    <input
                        type="number"
                        min="0"
                        value={yCoord}
                        onChange={(e) => setYCoord(parseInt(e.target.value) || 0)}
                        style={{ width: "80px", padding: 5 }}
                    />
                </div>
            </div>

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
                disabled={loading || !pdfFile || !signatureFile}
                style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                }}
            >
                {loading ? "Processing..." : "Sign PDF"}
            </button>
        </div>
    );
}
