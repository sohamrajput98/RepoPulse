import { useState } from "react";

/* ── Scan overlay animation ──────────────────────────────── */
function ScanOverlay({ status }) {
  const steps = [
    { key: "clone", label: "Cloning repository", match: /clon/i },
    { key: "analyze", label: "Running analysis", match: /analyz/i },
    { key: "load", label: "Loading results", match: /load/i },
  ];

  const activeStep = steps.findIndex((s) => s.match.test(status));

  return (
    <div
      style={{
        marginTop: "0.85rem",
        padding: "0.85rem 1rem",
        borderRadius: 10,
        background: "color-mix(in srgb, var(--accent) 6%, var(--bg-raise))",
        border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
      }}
    >
      {/* step indicators */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.65rem" }}>
        {steps.map((s, i) => {
          const done = i < activeStep;
          const current = i === activeStep;
          return (
            <div
              key={s.key}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  height: 3,
                  borderRadius: 99,
                  background:
                    done || current ? "var(--accent)" : "var(--border)",
                  boxShadow: current ? "0 0 8px var(--glow-c4)" : "none",
                  transition: "background 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {current && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                      animation: "scanShimmer 1.2s linear infinite",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: current ? 700 : 500,
                  color: current
                    ? "var(--accent)"
                    : done
                      ? "var(--text-secondary)"
                      : "var(--text-muted)",
                  transition: "color 0.2s",
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* status line with neon pulse dot */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--glow-c4)",
            flexShrink: 0,
            animation: "neonPulse 1.1s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--accent)",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

/* ── GitHubInput ─────────────────────────────────────────── */
export default function GitHubInput({ onLoad }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");

  async function handle() {
    setErr("");
    setStatus("");
    const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) {
      setErr("Enter a valid GitHub repo URL");
      return;
    }

    setLoading(true);
    setStatus("Cloning repository…");

    try {
      const res = await fetch("http://localhost:7777/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      setStatus("Running analysis…");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setStatus("Loading results…");
      await new Promise((r) => setTimeout(r, 600));
      const rep = await fetch("/analysis_report.json?t=" + Date.now());
      const report = await rep.json();
      if (!report.summary || !Array.isArray(report.files))
        throw new Error("Invalid report");
      report.healthScore = report.summary.healthScore;
      onLoad(report);
      setStatus("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="upload-card no-print"
      style={{ padding: "1.1rem 1.25rem", marginBottom: "1.25rem" }}
    >
      <p className="card-header">Analyze GitHub Repository</p>

      {/* input row */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          placeholder="https://github.com/user/repo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handle()}
          disabled={loading}
        />
        <button
          onClick={handle}
          disabled={loading}
          className="btn-primary"
          style={{ whiteSpace: "nowrap", minWidth: 130 }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "btnSpin 0.7s linear infinite",
                  display: "inline-block",
                }}
              />
              Working…
            </span>
          ) : (
            "⚡ Analyze"
          )}
        </button>
      </div>

      {/* scan overlay — shows while loading */}
      {loading && status && <ScanOverlay status={status} />}

      {/* error */}
      {err && (
        <p
          style={{
            marginTop: 8,
            fontSize: "0.78rem",
            color: "var(--score-poor)",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span>⚠</span> {err}
        </p>
      )}

      <style>{`
                @keyframes btnSpin {
                    to { transform: rotate(360deg); }
                }
                @keyframes neonPulse {
                    0%,100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px var(--glow-c4); }
                    50%     { opacity: 0.5; transform: scale(1.4); box-shadow: 0 0 14px var(--glow-c4); }
                }
                @keyframes scanShimmer {
                    from { transform: translateX(-100%); }
                    to   { transform: translateX(300%); }
                }
            `}</style>
    </div>
  );
}
