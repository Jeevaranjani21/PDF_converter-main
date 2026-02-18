import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

export default function ReorderPagesTool() {
    const [file, setFile] = useState(null);
    const [order, setOrder] = useState("");
    const [outputName, setOutputName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!file) return alert("Upload a PDF first!");
        if (!order) return alert("Enter page order!");

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("file", file);
            fd.append("order", order);

            const res = await fetch(`${API_BASE}/api/reorder-pages/`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Reorder failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (outputName || file.name.replace(/\.pdf$/i, "") + "_reordered") + ".pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to reorder pages.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolCard" style={{ marginTop: 24 }}>
            <h3>Reorder Pages</h3>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFile(f);
                        if (f) setOutputName(f.name.replace(/\.pdf$/i, "") + "_reordered");
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
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 5 }}>Page Order:</label>
                <input
                    type="text"
                    placeholder="e.g. 1, 3, 2, 4-6"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    style={{ padding: 8, width: "100%", borderRadius: 5, border: "1px solid #ccc" }}
                />
                <small style={{ color: "#666" }}>Enter the page numbers in the desired order.</small>
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading || !file || !order}
                style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                }}
            >
                {loading ? "Processing..." : "Reorder Pages"}
            </button>
        </div>
    );
}
