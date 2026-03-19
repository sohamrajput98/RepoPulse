import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Analyze() {
  const { refresh, loading } = useReport();
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");

  async function handleGitHub() {
    setErr("");
    setStatus("");
    const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) {
      setErr("Enter a valid GitHub repo URL");
      return;
    }

    setStatus("Cloning & analyzing…");
    try {
      const res = await fetch("http://localhost:7777/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setStatus("Loading results…");
      await refresh();
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
      setStatus("");
    }
  }

  async function handleLocal() {
    setErr("");
    setStatus("Loading local report…");
    try {
      await refresh();
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
      setStatus("");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* Theme toggle */}
      <button
        onClick={() => setDark((d) => !d)}
        className="btn-ghost"
        style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {/* Logo */}
      <div
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "2.8rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          marginBottom: "0.5rem",
          animation: "fadeUp 0.5s ease forwards",
        }}
      >
        <span style={{ color: "var(--accent)" }}>⚡</span> RepoPulse
      </div>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "1rem",
          marginBottom: "2.5rem",
          textAlign: "center",
          animation: "fadeUp 0.5s 0.1s ease both",
        }}
      >
        Code health monitoring for C++ repositories
      </p>

      {/* Card */}
      <div
        className="card"
        style={{
          padding: "2rem",
          width: "100%",
          maxWidth: 480,
          animation: "scaleIn 0.4s 0.15s ease both",
        }}
      >
        <p className="card-header">Analyze GitHub Repository</p>

        <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
          <input
            className="input"
            placeholder="https://github.com/user/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleGitHub()}
            disabled={loading}
          />
          <button
            onClick={handleGitHub}
            disabled={loading}
            className="btn-primary"
            style={{ whiteSpace: "nowrap", minWidth: 110 }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                Working…
              </span>
            ) : (
              "Analyze"
            )}
          </button>
        </div>

        {status && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent)",
                animation: "pulse 1.5s infinite",
              }}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
              {status}
            </span>
          </div>
        )}
        {err && (
          <p
            style={{
              color: "var(--score-poor)",
              fontSize: "0.8rem",
              marginBottom: 8,
            }}
          >
            ⚠ {err}
          </p>
        )}

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            margin: "1rem 0",
          }}
        />

        <p className="card-header">Or use local report</p>
        <button
          onClick={handleLocal}
          disabled={loading}
          className="btn-ghost"
          style={{ width: "100%" }}
        >
          Load analysis_report.json
        </button>
      </div>

      <style>{`
                @keyframes spin   { to { transform: rotate(360deg); } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn{ from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
            `}</style>
    </div>
  );
}
