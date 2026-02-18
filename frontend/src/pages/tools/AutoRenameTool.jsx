import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

export default function AutoRenameTool() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!file) return alert("Upload a PDF first!");

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch(`${API_BASE}/api/auto-rename/`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Rename failed");
            }

            // Get filename from Content-Disposition if possible, else default
            let filename = "renamed.pdf";
            const disposition = res.headers.get("Content-Disposition");
            if (disposition && disposition.includes("filename=")) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to auto-rename PDF.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolCard" style={{ marginTop: 24 }}>
            <h3>Auto Rename PDF</h3>
            <p style={{ fontSize: "0.9em", color: "#666", marginBottom: 16 }}>
                Automatically renames the file based on its title or content.
            </p>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
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
                {loading ? "Processing..." : "Auto Rename"}
            </button>
        </div>
    );
}
