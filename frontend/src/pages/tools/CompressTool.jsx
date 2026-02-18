import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

export default function CompressTool() {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("recommended");
  const [loading, setLoading] = useState(false);

  const [outputName, setOutputName] = useState("");

  const estimateText = (() => {
    if (level === "low") return "Low compression • Better quality • Larger file";
    if (level === "high") return "High compression • Smaller file • May reduce quality";
    return "Recommended • Balanced size & quality";
  })();

  const handleSubmit = async () => {
    if (!file) return alert("Upload a PDF first!");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("level", level);

      const res = await fetch(`${API_BASE}/api/compress/`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Compression failed");
      }

      // download file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (outputName || file.name.replace(/\.pdf$/i, "") + `_compressed_${level}`) + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Compression failed. Check console/backend terminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categoryPage">


      <div style={{ marginTop: 24 }} className="toolCard">
        <div style={{ width: "100%" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>1) Upload PDF</div>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              if (f) setOutputName(f.name.replace(/\.pdf$/i, "") + "_compressed");
            }}
          />
          {file && (
            <div style={{ marginTop: 10, color: "#64748b", fontSize: 13 }}>
              Selected: <b>{file.name}</b> ({Math.round(file.size / 1024)} KB)
            </div>
          )}

          <div style={{ marginTop: 18, fontWeight: 700 }}>2) Compression level</div>

          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            {[
              { id: "low", label: "Low" },
              { id: "recommended", label: "Recommended" },
              { id: "high", label: "High" },
            ].map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setLevel(x.id)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: level === x.id ? "#2563eb" : "white",
                  color: level === x.id ? "white" : "#0f172a",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {x.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 18, fontWeight: 700 }}>3) Output Filename</div>
          <input
            type="text"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            placeholder="Enter output filename"
            style={{
              marginTop: 10,
              padding: "10px",
              width: "100%",
              borderRadius: 8,
              border: "1px solid #e2e8f0"
            }}
          />

          <div style={{ marginTop: 10, color: "#64748b", fontSize: 13 }}>
            {estimateText}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || loading}
            style={{
              marginTop: 18,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: !file || loading ? "#94a3b8" : "#2563eb",
              color: "white",
              fontWeight: 800,
              cursor: !file || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Compressing..." : "Compress & Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
