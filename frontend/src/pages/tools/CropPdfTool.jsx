import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function CropPdfTool() {
    const [file, setFile] = useState(null);
    const [box, setBox] = useState(""); // "x,y,w,h"
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
            if (box) formData.append("box", box);

            const res = await axios.post(`${API_BASE}/api/crop/`, formData, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            setResultUrl(url);
        } catch (e) {
            setErr(e.message || "Failed to crop PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="categoryPage">
            <h1 className="pageTitle">Crop PDF</h1>
            <p className="pageSubtitle">Crop pages to a specific area.</p>

            <div style={{ marginTop: 18 }}></div>

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

            <div className="toolCard">
                <div style={{ width: "100%" }}>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>2) Crop Options</div>

                    <div style={{ marginBottom: 14 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Crop Box (x, y, width, height)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 50,50,500,700"
                            value={box}
                            onChange={(e) => setBox(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                            }}
                        />
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                            Enter points (1/72 inch). Leave empty for no change (test).
                        </div>
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
                        {loading ? "Processing..." : "Crop PDF →"}
                    </button>

                    {err && <div style={{ color: "#ef4444", marginTop: 10, fontWeight: 600 }}>{err}</div>}
                </div>
            </div>

            {resultUrl && (
                <div style={{ marginTop: 18 }}>
                    <div className="toolCard">
                        <div style={{ width: "100%" }}>
                            <div style={{ fontWeight: 800, marginBottom: 10 }}>✅ Ready</div>
                            <a
                                href={resultUrl}
                                download="cropped.pdf"
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
