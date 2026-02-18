import React, { useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function ProtectTool() {
    const { toolId } = useParams();
    const isLockMode = toolId === "lock";

    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [outputName, setOutputName] = useState("");
    const [loading, setLoading] = useState(false);

    // Permissions state (only for Protect mode)
    const [permissions, setPermissions] = useState({
        print: true,
        copy: true,
        modify: true,
        annotate: true,
        extract: true
    });

    const handlePermissionChange = (e) => {
        setPermissions({ ...permissions, [e.target.name]: e.target.checked });
    };

    const handleSubmit = async () => {
        if (!file) return alert("Upload a PDF first!");
        if (isLockMode && !password) return alert("Enter a password to lock the PDF!");
        // For protect mode, password is optional (defaults to restricted owner), but usually good to set one.
        // If they want to restrict permissions, they assume the user is "user" and we set an owner password behind the scenes
        // or we ask them for an owner password.
        // For simplicity, we'll use the provided password as both User/Owner if provided, 
        // or just Owner if "Protect" and no password (so it opens freely but is restricted).

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("file", file);
            fd.append("password", password);

            if (!isLockMode) {
                // Collect allowed permissions
                const allowed = [];
                if (permissions.print) allowed.push("print");
                if (permissions.copy) allowed.push("copy");
                if (permissions.modify) allowed.push("modify");
                if (permissions.annotate) allowed.push("annotate");
                if (permissions.extract) allowed.push("extract");
                fd.append("permissions", allowed.join(","));
            }

            const res = await fetch(`${API_BASE}/api/protect/`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Protection failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (outputName || (isLockMode ? "locked_" : "protected_") + file.name) + (outputName ? ".pdf" : "");
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to process PDF.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="toolCard" style={{ marginTop: 24 }}>
            <h3>{isLockMode ? "Lock PDF" : "Protect PDF"}</h3>
            <p style={{ marginBottom: 20, color: "#666" }}>
                {isLockMode
                    ? "Add a password to prevent others from opening this PDF."
                    : "Set permissions to restrict printing, copying, or modifying logic."}
            </p>

            <div style={{ marginBottom: 16 }}>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFile(f);
                        if (f) {
                            const prefix = isLockMode ? "locked_" : "protected_";
                            setOutputName(prefix + f.name.replace(/\.pdf$/i, ""));
                        }
                    }}
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 5 }}>
                    {isLockMode ? "Password (Required):" : "Owner Password (Optional):"}
                </label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: 8, width: "100%", borderRadius: 5, border: "1px solid #ccc" }}
                />
                {!isLockMode && <small style={{ color: "gray" }}>If left blank, file opens without a password but permissions apply (default owner pass used).</small>}
            </div>

            {!isLockMode && (
                <div style={{ marginBottom: 16, border: "1px solid #ddd", padding: 10, borderRadius: 5 }}>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: 10 }}>Allowed Permissions:</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <label><input type="checkbox" name="print" checked={permissions.print} onChange={handlePermissionChange} /> Print</label>
                        <label><input type="checkbox" name="copy" checked={permissions.copy} onChange={handlePermissionChange} /> Copy Content</label>
                        <label><input type="checkbox" name="modify" checked={permissions.modify} onChange={handlePermissionChange} /> Modify Content</label>
                        <label><input type="checkbox" name="annotate" checked={permissions.annotate} onChange={handlePermissionChange} /> Annotate / Forms</label>
                        <label><input type="checkbox" name="extract" checked={permissions.extract} onChange={handlePermissionChange} /> Extract Text/Graphics</label>
                    </div>
                </div>
            )}

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
                disabled={loading || !file || (isLockMode && !password)}
                style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                }}
            >
                {loading ? "Processing..." : (isLockMode ? "Lock PDF" : "Protect PDF")}
            </button>
        </div>
    );
}
