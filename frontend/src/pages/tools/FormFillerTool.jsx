import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function FormFillerTool() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultUrl, setResultUrl] = useState(null);
    const [err, setErr] = useState("");
    const [fields, setFields] = useState("{}");

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
            formData.append("fields", fields);

            const res = await axios.post(`${API_BASE}/api/form-fill/`, formData, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            setResultUrl(url);
        } catch (e) {
            setErr(e.message || "Failed to fill form");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="categoryPage">
            <h1 className="pageTitle">PDF Form Filler</h1>
            <p className="pageSubtitle">Fill PDF forms programmatically.</p>

            <div style={{ marginTop: 18 }}></div>

            <div className="toolCard">
                <div style={{ width: "100%" }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>1) Upload PDF Form</div>
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
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>2) Field Data (JSON)</div>

                    <textarea
                        rows={5}
                        value={fields}
                        onChange={(e) => setFields(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            fontFamily: "monospace"
                        }}
                    />
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                        Enter JSON object {'{"FieldName": "Value"}'}
                    </div>

                    <button
                        onClick={onProcess}
                        disabled={loading || !file}
                        style={{
                            marginTop: 14,
                            padding: "12px 16px",
                            borderRadius: 12,
                            background: loading || !file ? "#94a3b8" : "#2563eb",
                            color: "white",
                            fontWeight: 800,
                            border: "none",
                            cursor: loading || !file ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Processing..." : "Fill Form →"}
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
                                download="filled.pdf"
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
