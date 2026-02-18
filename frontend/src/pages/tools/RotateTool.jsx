import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

export default function RotateTool() {
    const [file, setFile] = useState(null);
    const [angle, setAngle] = useState(90);
    const [outputName, setOutputName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!file) return alert("Upload a PDF first!");

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("file", file);
            fd.append("angle", angle);

            const res = await fetch(`${API_BASE}/api/rotate/`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Rotate failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (outputName || file.name.replace(/\.pdf$/i, "") + "_rotated") + ".pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to rotate PDF.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolCard" style={{ marginTop: 24 }}>
            <h3>Rotate PDF</h3>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFile(f);
                        if (f) setOutputName(f.name.replace(/\.pdf$/i, "") + "_rotated");
                    }}
                />
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
            <div style={{ marginBottom: 16 }}>
                <label style={{ marginRight: 10, fontWeight: "bold" }}>Rotation Angle:</label>
                <select value={angle} onChange={(e) => setAngle(e.target.value)} style={{ padding: 5 }}>
                    <option value="90">90 Degrees</option>
                    <option value="180">180 Degrees</option>
                    <option value="270">270 Degrees</option>
                </select>
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading || !file}
                style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                }}
            >
                {loading ? "Processing..." : "Rotate PDF"}
            </button>
        </div>
    );
}
