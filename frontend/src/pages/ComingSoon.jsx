import React from "react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon({ tool }) {
    const navigate = useNavigate();

    return (
        <div className="categoryPage" style={{ textAlign: "center", marginTop: 40 }}>
            {/* Back Button */}
            <div style={{ textAlign: "left", marginBottom: 20 }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        background: "white",
                        cursor: "pointer",
                        fontWeight: 600,
                        color: "#64748b"
                    }}
                >
                    ← Back
                </button>
            </div>

            <div style={{ fontSize: 48, marginBottom: 20 }}>🚧</div>
            <h1 className="pageTitle" style={{ marginBottom: 10 }}>{tool?.name || "Feature"}</h1>
            <p className="pageSubtitle" style={{ marginBottom: 30 }}>
                {tool?.desc || "This feature is coming soon!"}
            </p>

            <div
                style={{
                    display: "inline-block",
                    padding: "20px 40px",
                    background: "#f1f5f9",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    color: "#475569",
                    fontWeight: 500,
                }}
            >
                We are working hard to bring you this tool.<br />
                Stay tuned for updates!
            </div>
        </div>
    );
}
