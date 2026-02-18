import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function SharePdfTool() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shareLink, setShareLink] = useState(null);
    const [err, setErr] = useState("");

    const onProcess = async () => {
        if (!file) {
            setErr("Please upload a PDF first.");
            return;
        }
        setErr("");
        setLoading(true);
        setShareLink(null);

        try {
            // reusing split api to get a stored file URL
            const formData = new FormData();
            formData.append("file", file);
            formData.append("mode", "single");

            const res = await axios.post(`${API_BASE}/api/split/prepare/`, formData);
            const data = res.data;

            if (data.results && data.results.length > 0) {
                // Construct full URL
                const relativeUrl = data.results[0].url;
                const fullUrl = `${API_BASE}${relativeUrl}`;
                setShareLink(fullUrl);
            } else {
                throw new Error("Failed to generate link");
            }

        } catch (e) {
            setErr(e.message || "Failed to share PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="categoryPage">
            <h1 className="pageTitle">Share PDF</h1>
            <p className="pageSubtitle">Upload and get a shareable link.</p>

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
                        {loading ? "Generating Link..." : "Get Link →"}
                    </button>

                    {err && <div style={{ color: "#ef4444", marginTop: 10, fontWeight: 600 }}>{err}</div>}
                </div>
            </div>

            {shareLink && (
                <div style={{ marginTop: 18 }}>
                    <div className="toolCard">
                        <div style={{ width: "100%" }}>
                            <div style={{ fontWeight: 800, marginBottom: 10 }}>✅ Share Link</div>
                            <input
                                type="text"
                                readOnly
                                value={shareLink}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    background: "#f1f5f9"
                                }}
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(shareLink)}
                                style={{
                                    marginTop: 10,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    background: "#0f172a",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: 600
                                }}
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
