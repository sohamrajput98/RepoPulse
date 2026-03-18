import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Intro — logo blooms in center (0→2s), slides to top-left (2→2.8s),
 * then navigates to /analyze.
 *
 * Phase 0: hidden
 * Phase 1: bloom  — logo scales+fades in at center
 * Phase 2: slide  — logo translates to top-left corner
 * Phase 3: done   — navigate
 */
export default function Intro() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0); // 0=hidden 1=bloom 2=slide

  useEffect(() => {
    // tiny delay so first paint fires before animation begins
    const t0 = setTimeout(() => setPhase(1), 80);
    const t1 = setTimeout(() => setPhase(2), 2000);
    const t2 = setTimeout(() => navigate("/analyze", { replace: true }), 2900);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [navigate]);

  /* ── derived styles per phase ─────────────────────────── */
  const logoStyle = (() => {
    const base = {
      position: "fixed",
      display: "flex",
      alignItems: "center",
      gap: "0.55rem",
      fontFamily: "Syne, sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      userSelect: "none",
      willChange: "transform, opacity",
      transformOrigin: "top left",
    };

    if (phase === 0)
      return {
        ...base,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(0.6)",
        opacity: 0,
        fontSize: "3.8rem",
        transition: "none",
      };

    if (phase === 1)
      return {
        ...base,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(1)",
        opacity: 1,
        fontSize: "3.8rem",
        transition:
          "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
      };

    // phase 2 — slide to top-left
    return {
      ...base,
      top: "1.4rem",
      left: "1.5rem",
      transform: "translate(0, 0) scale(1)",
      opacity: 1,
      fontSize: "1.25rem",
      transition: [
        "top 0.65s cubic-bezier(0.4,0,0.2,1)",
        "left 0.65s cubic-bezier(0.4,0,0.2,1)",
        "font-size 0.65s cubic-bezier(0.4,0,0.2,1)",
      ].join(", "),
    };
  })();

  /* ── background particles ─────────────────────────────── */
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: `${(i * 17 + 11) % 100}%`,
    y: `${(i * 23 + 7) % 100}%`,
    size: 2 + (i % 4),
    delay: `${(i * 0.3) % 2}s`,
    color: ["var(--c1)", "var(--c4)", "var(--c2)", "var(--c5)", "var(--c3)"][
      i % 5
    ],
  }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-base)",
        overflow: "hidden",
      }}
    >
      {/* ── animated dot grid background ── */}
      {dots.map((d) => (
        <span
          key={d.id}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.color,
            opacity: phase >= 1 ? 0.35 : 0,
            transition: `opacity 1.2s ease ${d.delay}`,
            animation:
              phase >= 1
                ? `introPulse 3s ${d.delay} ease-in-out infinite`
                : "none",
          }}
        />
      ))}

      {/* ── glowing halo behind logo ── */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--glow-c4) 0%, transparent 70%)",
          opacity: phase === 1 ? 0.6 : 0,
          transition: "opacity 0.8s ease",
          pointerEvents: "none",
        }}
      />

      {/* ── logo ── */}
      <div style={logoStyle}>
        <span
          style={{
            color: "var(--accent)",
            display: "inline-block",
            animation: phase === 1 ? "boltSpin 0.7s ease" : "none",
          }}
        >
          ⚡
        </span>
        <span style={{ color: "var(--text-primary)" }}>RepoPulse</span>
        {/* v-chip only visible in top-left (phase 2) */}
        {phase === 2 && (
          <span
            className="badge badge-accent"
            style={{ fontSize: "0.62rem", marginLeft: 2, opacity: 1 }}
          >
            v1.0
          </span>
        )}
      </div>

      {/* ── tagline — visible only during bloom ── */}
      <div
        style={{
          position: "fixed",
          top: "calc(50% + 3.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: phase === 1 ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          Code health monitoring for C++ repositories
        </p>
      </div>

      {/* ── progress bar at bottom ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          height: 3,
          width: phase >= 1 ? (phase === 2 ? "100%" : "55%") : "0%",
          background: "linear-gradient(90deg, var(--c4), var(--c5))",
          transition: phase === 1 ? "width 1.9s ease" : "width 0.7s ease",
          boxShadow: "0 0 12px var(--glow-c4)",
        }}
      />

      <style>{`
                @keyframes introPulse {
                    0%, 100% { transform: scale(1); opacity: 0.35; }
                    50%      { transform: scale(1.6); opacity: 0.6; }
                }
                @keyframes boltSpin {
                    0%   { transform: rotate(-30deg) scale(1.4); }
                    60%  { transform: rotate(15deg) scale(0.9); }
                    100% { transform: rotate(0deg) scale(1); }
                }
            `}</style>
    </div>
  );
}
