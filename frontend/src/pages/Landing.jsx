import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  IconComplexity,
  IconBrain,
  IconMap,
  IconTrendingUp,
  IconSkull,
  IconPuzzle,
  IconFunctions,
  IconFiles,
  IconSun,
  IconMoon,
  IconLightning,
} from "../components/icons";

/* ── Feature pills ───────────────────────────────────────── */
const FEATURES = [
  { icon: IconComplexity, label: "Cyclomatic Complexity" },
  { icon: IconBrain, label: "AI Suggestions" },
  { icon: IconMap, label: "Risk Heatmap" },
  { icon: IconTrendingUp, label: "Health Trends" },
  { icon: IconSkull, label: "Dead Code Detection" },
  { icon: IconPuzzle, label: "Code Smell Analysis" },
  { icon: IconFunctions, label: "Function Metrics" },
  { icon: IconFiles, label: "File Tree View" },
];

/* ── Animated grid background ────────────────────────────── */
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
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern
            id="ldots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="var(--border-strong)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ldots)" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg-base) 85%)",
        }}
      />
    </div>
  );
}

/* ── Spinner ─────────────────────────────────────────────── */
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

/* ── Landing ─────────────────────────────────────────────── */
export default function Landing() {
  const { refresh, report } = useReport();
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [visible, setVisible] = useState(false);
  const [readyNav, setReadyNav] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  /* Navigate once report is loaded into context */
  useEffect(() => {
    if (readyNav && report) {
      navigate("/dashboard", { replace: true });
    }
  }, [readyNav, report, navigate]);

  async function runAnalyze(fetchFn) {
    setErr("");
    setStatus("");
    setLoading(true);
    try {
      await fetchFn();
      setStatus("Loading results…");
      setReadyNav(true);
      await refresh();
      /* navigate happens via useEffect above once report lands in context */
    } catch (e) {
      setErr(e.message);
      setStatus("");
      setReadyNav(false);
    } finally {
      setLoading(false);
    }
  }

  /* ── Analyze GitHub repo ── */
  async function handleAnalyze() {
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

    await runAnalyze(async () => {
      setStatus("Cloning repository…");
      const res = await fetch("http://localhost:7777/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setStatus("Analysis complete…");
    });
  }

  /* ── Load local report ── */
  async function handleDemo() {
    await runAnalyze(async () => {
      setStatus("Loading local report…");
      /* reportService will fetch /analysis_report.json — no extra step needed */
    });
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

      {/* theme toggle */}
      <button
        onClick={() => setDark((d) => !d)}
        className="btn-ghost"
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 10,
        }}
      >
        {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
      </button>

      {/* logo */}
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
        <IconLightning size={20} style={{ color: "var(--accent)" }} />
        <span>RepoPulse</span>
        <span className="badge badge-accent" style={{ fontSize: "0.62rem" }}>
          v1.0
        </span>
      </div>

      {/* hero */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 640,
          width: "100%",
          textAlign: "center",
        }}
      >
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

        {/* input card */}
        <div
          className="upload-card"
          style={{ padding: "1.5rem", marginBottom: "1rem", ...anim(240) }}
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
                  <Spinner /> {status || "Working…"}
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <IconLightning size={16} />
                  Analyze Repo
                </span>
              )}
            </button>
          </div>
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

        {/* demo button */}
        <div style={anim(300)}>
          <button
            onClick={handleDemo}
            disabled={loading}
            className="btn-ghost"
            style={{
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <IconFiles size={16} />
            Load Demo Report
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

        {/* feature pills */}
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
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                animation: visible
                  ? `fadeUp 0.5s ease ${400 + i * 50}ms both`
                  : "none",
              }}
            >
              <f.icon size={14} />
              {f.label}
            </span>
          ))}
        </div>
      </div>

      <style>{`
                @keyframes blobFloat { from { transform: translate(-50%,-50%) scale(1); } to { transform: translate(-50%,-50%) scale(1.15) translateY(-20px); } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
    </div>
  );
}
