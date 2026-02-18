import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

export default function MergeTool() {
    const [files, setFiles] = useState([]);
    const [outputName, setOutputName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const f = Array.from(e.target.files);
            setFiles(f);
            if (f.length > 0) {
                setOutputName(f[0].name.replace(/\.pdf$/i, "") + "_merged");
            }
        }
    };

    const handleSubmit = async () => {
        if (files.length < 2) return alert("Select at least 2 PDF files!");

        try {
            setLoading(true);
            const fd = new FormData();
            files.forEach((f) => fd.append("files", f));

            const res = await fetch(`${API_BASE}/api/merge/`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Merge failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (outputName || "merged") + ".pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to merge PDFs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolCard" style={{ marginTop: 24 }}>
            <h3>Merge PDFs</h3>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                />
                <div style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
                    {files.length > 0 ? `${files.length} files selected` : "Select multiple files"}
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
                disabled={loading || files.length < 2}
                style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                }}
            >
                {loading ? "Processing..." : "Merge PDFs"}
            </button>
        </div>
    );
}
