import React, { useMemo, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function SplitTool() {
  const [file, setFile] = useState(null);

  const [mode, setMode] = useState("range"); // "range" | "every" | "single"
  const [rangeText, setRangeText] = useState("1-3,5,8-10");
  const [everyN, setEveryN] = useState(2);
  const [baseName, setBaseName] = useState("split");

  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [err, setErr] = useState("");

  const canRun = useMemo(() => {
    if (!file) return false;
    if (mode === "range") return rangeText.trim().length > 0;
    if (mode === "every") return Number(everyN) > 0;
    return true; // single
  }, [file, mode, rangeText, everyN]);

  const onSplit = async () => {
    setErr("");
    setJob(null);

    if (!file) return setErr("Upload a PDF first.");

    try {
      setLoading(true);

      const form = new FormData();
      form.append("file", file);
      form.append("mode", mode);
      form.append("base_name", baseName || "split");

      if (mode === "range") form.append("range", rangeText);
      if (mode === "every") form.append("every", String(everyN));

      console.log(`Splitting via ${API_BASE}/api/split/prepare/`);
      const res = await fetch(`${API_BASE}/api/split/prepare/`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Split failed");

      setJob(data);
    } catch (e) {
      setErr(e.message || "Split failed");
    } finally {
      setLoading(false);
    }
  };

  const absUrl = (u) => {
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return API_BASE + (u.startsWith("/") ? u : `/${u}`);
  };

  return (
    <div className="categoryPage">
      <h1 className="pageTitle">Split PDF</h1>
      <p className="pageSubtitle">
        Split by range, split every N pages, or split into single pages — download as ZIP or individually.
      </p>

      <div style={{ marginTop: 18 }} />

      {/* Upload */}
      <div className="toolCard" style={{ cursor: "default" }}>
        <div style={{ width: "100%" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>1) Upload PDF</div>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              if (f) setBaseName(f.name.replace(/\.pdf$/i, "") + "_split");
            }}
          />
          {file && (
            <div style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
              Selected: <b>{file.name}</b> ({Math.round(file.size / 1024)} KB)
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }} />

      {/* Options */}
      <div className="toolCard" style={{ cursor: "default" }}>
        <div style={{ width: "100%" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>2) Split Options</div>

          {/* Base name */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ minWidth: 160, fontWeight: 600 }}>Output base name:</div>
            <input
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                minWidth: 260,
              }}
              placeholder="split"
            />
          </div>

          <div style={{ marginTop: 14 }} />

          {/* Mode */}
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Choose mode:</div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="radio"
                name="mode"
                checked={mode === "range"}
                onChange={() => setMode("range")}
              />
              Split by range
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="radio"
                name="mode"
                checked={mode === "every"}
                onChange={() => setMode("every")}
              />
              Split every N pages
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="radio"
                name="mode"
                checked={mode === "single"}
                onChange={() => setMode("single")}
              />
              Split into single pages
            </label>
          </div>

          <div style={{ marginTop: 14 }} />

          {/* Mode inputs */}
          {mode === "range" && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ minWidth: 160, fontWeight: 600 }}>Range:</div>
              <input
                value={rangeText}
                onChange={(e) => setRangeText(e.target.value)}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  minWidth: 360,
                }}
                placeholder="1-3,5,8-10"
              />
              <div style={{ color: "#64748b", fontSize: 12 }}>
                Example: <b>1-3,5,8-10</b>
              </div>
            </div>
          )}

          {mode === "every" && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ minWidth: 160, fontWeight: 600 }}>Every:</div>
              <input
                type="number"
                min={1}
                value={everyN}
                onChange={(e) => setEveryN(Number(e.target.value))}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  width: 120,
                }}
              />
              <div style={{ color: "#64748b", fontSize: 12 }}>pages</div>
            </div>
          )}

          {mode === "single" && (
            <div style={{ color: "#64748b", fontSize: 13 }}>
              This will output one PDF per page.
            </div>
          )}

          <div style={{ marginTop: 18 }} />

          <button
            onClick={onSplit}
            disabled={!canRun || loading}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              background: canRun && !loading ? "#2563eb" : "#94a3b8",
              color: "white",
              cursor: canRun && !loading ? "pointer" : "not-allowed",
              fontWeight: 800,
            }}
          >
            {loading ? "Splitting..." : "Split →"}
          </button>

          {err && (
            <div style={{ marginTop: 12, color: "#b91c1c", fontWeight: 600 }}>
              {err}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {job && (
        <div style={{ marginTop: 18 }}>
          <div className="toolCard" style={{ cursor: "default" }}>
            <div style={{ width: "100%" }}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>✅ Ready</div>

              <a
                href={absUrl(job.zipUrl)}
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
                ⬇ Download ZIP
              </a>

              <div style={{ marginTop: 14, fontWeight: 700 }}>Files:</div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {(job.results || []).map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      padding: 12,
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      background: "white",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, wordBreak: "break-word" }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {Math.round((f.size || 0) / 1024)} KB
                      </div>
                    </div>

                    <a
                      href={absUrl(f.url)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        textDecoration: "none",
                        fontWeight: 800,
                        color: "#0f172a",
                        background: "#f8fafc",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⬇ PDF
                    </a>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
