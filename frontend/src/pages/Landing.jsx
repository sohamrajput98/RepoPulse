import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext";
import { useDarkMode } from "../hooks/useDarkMode";

/* ── feature pills ─────────────────────────────────────────── */
const FEATURES = [
  { icon: "🔬", label: "Cyclomatic Complexity" },
  { icon: "🧠", label: "AI Suggestions" },
  { icon: "🗺️", label: "Risk Heatmap" },
  { icon: "📈", label: "Health Trends" },
  { icon: "💀", label: "Dead Code Detection" },
  { icon: "🧩", label: "Code Smell Analysis" },
  { icon: "⚙️", label: "Function Metrics" },
  { icon: "📁", label: "File Tree View" },
];

/* ── animated grid background ─────────────────────────────── */
function GridBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* dot grid via SVG pattern */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="var(--border-strong)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* radial gradient mask so grid fades at edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg-base) 85%)",
        }}
      />

      {/* floating neon blobs */}
      {[
        { color: "var(--glow-c4)", x: "15%", y: "20%", size: 420 },
        { color: "var(--glow-c5)", x: "80%", y: "60%", size: 360 },
        { color: "var(--glow-c2)", x: "60%", y: "10%", size: 280 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            animation: `blobFloat ${6 + i * 2}s ease-in-out infinite alternate`,
            animationDelay: `${i * 1.3}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── main page ─────────────────────────────────────────────── */
export default function Landing() {
  const { refresh } = useReport();
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  /* ── analyze via backend ── */
  async function handleAnalyze() {
    setErr("");
    setStatus("");
    if (!url.trim()) {
      setErr("Please enter a GitHub URL");
      return;
    }
    const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) {
      setErr(
        "Enter a valid GitHub repo URL (e.g. https://github.com/user/repo)",
      );
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setStatus("Loading results…");
      await refresh();
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  /* ── load local demo report ── */
  async function handleDemo() {
    setErr("");
    setStatus("Loading demo…");
    setLoading(true);
    try {
      await refresh();
      navigate("/dashboard");
    } catch (e) {
      setErr(
        "Could not load local report. Make sure analysis_report.json exists.",
      );
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        overflow: "hidden",
      }}
    >
      <GridBackground />

      {/* ── theme toggle ── */}
      <button
        onClick={() => setDark((d) => !d)}
        className="btn-ghost"
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 10,
        }}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {/* ── logo in top-left (matches where Intro.jsx leaves it) ── */}
      <div
        style={{
          position: "absolute",
          top: "1.4rem",
          left: "1.5rem",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "1.25rem",
          letterSpacing: "-0.01em",
          ...anim(0),
        }}
      >
        <span style={{ color: "var(--accent)" }}>⚡</span>
        <span>RepoPulse</span>
        <span className="badge badge-accent" style={{ fontSize: "0.62rem" }}>
          v1.0
        </span>
      </div>

      {/* ── hero ── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 640,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* headline */}
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            ...anim(80),
          }}
        >
          Know your code's
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, var(--c4), var(--c5))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            health score
          </span>
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            marginBottom: "2.5rem",
            lineHeight: 1.6,
            ...anim(160),
          }}
        >
          Static analysis, complexity metrics, and AI-powered suggestions for
          your C++ repositories — in seconds.
        </p>

        {/* ── input card ── */}
        <div
          className="upload-card"
          style={{
            padding: "1.5rem",
            marginBottom: "1rem",
            ...anim(240),
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="https://github.com/user/repo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !loading && handleAnalyze()
              }
              disabled={loading}
              style={{ flex: 1, minWidth: 200 }}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn-primary"
              style={{ minWidth: 130 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Spinner /> Analyzing…
                </span>
              ) : (
                "⚡ Analyze Repo"
              )}
            </button>
          </div>

          {status && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 10,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  animation: "pulse 1.4s ease-in-out infinite",
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
                marginTop: 8,
                fontSize: "0.8rem",
                color: "var(--score-poor)",
              }}
            >
              ⚠ {err}
            </p>
          )}
        </div>

        {/* ── demo button ── */}
        <div style={{ ...anim(300) }}>
          <button
            onClick={handleDemo}
            disabled={loading}
            className="btn-ghost"
            style={{ fontSize: "0.85rem" }}
          >
            📂 Load Demo Report
          </button>
          <span
            style={{
              margin: "0 0.5rem",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
            }}
          >
            · uses local analysis_report.json
          </span>
        </div>

        {/* ── feature pills ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginTop: "2.5rem",
            ...anim(400),
          }}
        >
          {FEATURES.map((f, i) => (
            <span
              key={i}
              className="badge badge-neutral"
              style={{
                fontSize: "0.78rem",
                padding: "0.35rem 0.75rem",
                animation: visible
                  ? `fadeUp 0.5s ease ${400 + i * 50}ms both`
                  : "none",
              }}
            >
              {f.icon} {f.label}
            </span>
          ))}
        </div>
      </div>

      <style>{`
                @keyframes blobFloat {
                    from { transform: translate(-50%, -50%) scale(1); }
                    to   { transform: translate(-50%, -50%) scale(1.15) translateY(-20px); }
                }
                @keyframes pulse {
                    0%,100% { opacity: 1; transform: scale(1); }
                    50%     { opacity: 0.5; transform: scale(1.3); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        border: "2px solid rgba(255,255,255,0.35)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}
