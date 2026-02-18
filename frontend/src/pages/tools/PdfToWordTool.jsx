import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

export default function PdfToWordTool() {
    const [file, setFile] = useState(null);
    const [outputName, setOutputName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!file) return alert("Upload a PDF first!");

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch(`${API_BASE}/api/pdf-to-word/`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Conversion failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (outputName || file.name.replace(/\.pdf$/i, "")) + ".docx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to convert PDF to Word.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolCard" style={{ marginTop: 24 }}>
            <h3>PDF to Word</h3>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFile(f);
                        if (f) setOutputName(f.name.replace(/\.pdf$/i, ""));
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
                {loading ? "Converting..." : "Convert to Word"}
            </button>
        </div>
    );
}
