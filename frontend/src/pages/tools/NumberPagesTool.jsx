import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function NumberPagesTool() {
    const [file, setFile] = useState(null);
    const [position, setPosition] = useState("bottom-center");
    const [style, setStyle] = useState("1");
    const [loading, setLoading] = useState(false);
    const [resultUrl, setResultUrl] = useState(null);
    const [err, setErr] = useState("");

    const onProcess = async () => {
        if (!file) {
            setErr("Please upload a PDF first.");
            return;
        }
        setErr("");
        setLoading(true);
        setResultUrl(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("position", position);
            formData.append("style", style);

            const res = await axios.post(`${API_BASE}/api/number-pages/`, formData, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            setResultUrl(url);
        } catch (e) {
            setErr(e.message || "Failed to number pages");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="categoryPage">
            <h1 className="pageTitle">Number Pages</h1>
            <p className="pageSubtitle">Add page numbers to your PDF document.</p>

            <div style={{ marginTop: 18 }}></div>

            {/* Upload */}
            <div className="toolCard">
                <div style={{ width: "100%" }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>1) Upload PDF</div>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
            </div>

            <div style={{ marginTop: 16 }}></div>

            {/* Options */}
            <div className="toolCard">
                <div style={{ width: "100%" }}>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>2) Options</div>

                    <div style={{ marginBottom: 14 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>Position</label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                            }}
                        >
                            <option value="bottom-center">Bottom Center</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-right">Top Right</option>
                            <option value="top-left">Top Left</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>Style</label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                            }}
                        >
                            <option value="1">1, 2, 3...</option>
                            <option value="Page 1">Page 1, Page 2...</option>
                            <option value="Page 1 of N">Page 1 of N...</option>
                        </select>
                    </div>

                    <button
                        onClick={onProcess}
                        disabled={loading || !file}
                        style={{
                            padding: "12px 16px",
                            borderRadius: 12,
                            background: loading || !file ? "#94a3b8" : "#2563eb",
                            color: "white",
                            fontWeight: 800,
                            border: "none",
                            cursor: loading || !file ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Processing..." : "Add Numbers →"}
                    </button>

                    {err && <div style={{ color: "#ef4444", marginTop: 10, fontWeight: 600 }}>{err}</div>}
                </div>
            </div>

            {/* Result */}
            {resultUrl && (
                <div style={{ marginTop: 18 }}>
                    <div className="toolCard">
                        <div style={{ width: "100%" }}>
                            <div style={{ fontWeight: 800, marginBottom: 10 }}>✅ Ready</div>
                            <a
                                href={resultUrl}
                                download="numbered.pdf"
                                style={{
                                    display: "inline-block",
                                    padding: "12px 16px",
                                    borderRadius: 12,
                                    background: "#0f172a",
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: 800,
                                }}
                            >
                                ⬇ Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
