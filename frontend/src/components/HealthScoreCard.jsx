import { useRef, useEffect } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { useCountUp } from "../hooks/useCountUp";
import { useChartColors } from "../hooks/useChartColors";

/* ── Glow ring canvas overlay ────────────────────────────── */
function GlowRing({ score, color }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2,
      cy = H / 2;
    const r = W * 0.42;
    const startAngle = Math.PI;
    const endAngle = startAngle + Math.PI * (score / 100);

    ctx.clearRect(0, 0, W, H);

    // glow shadow
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }, [score, color]);

  return (
    <canvas
      ref={ref}
      width={200}
      height={110}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Penalty chip ────────────────────────────────────────── */
function PenaltyChip({ label, value }) {
  const severity = value > 15 ? "--c1" : value > 8 ? "--c3" : "--c4";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--bg-raise)",
        border: `1px solid color-mix(in srgb, var(${severity}) 25%, var(--border))`,
        borderRadius: 8,
        padding: "0.3rem 0.65rem",
        gap: "0.5rem",
      }}
    >
      <span
        style={{
          fontSize: "0.7rem",
          color: "var(--text-secondary)",
          textTransform: "capitalize",
          fontWeight: 500,
        }}
      >
        {label.replace("Penalty", "")}
      </span>
      <span
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: `var(${severity})`,
          background: `color-mix(in srgb, var(${severity}) 12%, transparent)`,
          padding: "0.1rem 0.4rem",
          borderRadius: 99,
        }}
      >
        −{value}
      </span>
    </div>
  );
}

/* ── Delta indicator ─────────────────────────────────────── */
function Delta({ value }) {
  if (value === null || value === undefined) return null;
  const up = value >= 0;
  const color = up ? "var(--score-excellent)" : "var(--score-poor)";
  return (
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
        borderRadius: 99,
        padding: "0.1rem 0.45rem",
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {up ? "▲" : "▼"} {Math.abs(value)}
    </span>
  );
}

/* ── HealthScoreCard ─────────────────────────────────────── */
export default function HealthScoreCard({ score, label, breakdown, delta }) {
  const colors = useChartColors();
  const animated = useCountUp(Math.round(score ?? 0), 1200);
  const s = score ?? 0;

  /* pick palette-aware score colour from resolved CSS vars */
  const scoreColorResolved = (() => {
    if (s >= 85) return colors.scoreExcellent || "var(--score-excellent)";
    if (s >= 70) return colors.scoreGood || "var(--score-good)";
    if (s >= 50) return colors.scoreFair || "var(--score-fair)";
    if (s >= 30) return colors.scorePoor || "var(--score-poor)";
    return colors.scoreCritical || "var(--score-critical)";
  })();

  /* radial bar data */
  const data = [{ value: s, fill: scoreColorResolved }];

  return (
    <div
      className="card"
      style={{
        padding: "1.25rem 1.25rem 1rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle bg glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: 80,
          background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${scoreColorResolved} 18%, transparent), transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* header + delta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginBottom: "0.25rem",
        }}
      >
        <p className="card-header" style={{ marginBottom: 0 }}>
          Health Score
        </p>
        <Delta value={delta} />
      </div>

      {/* radial bar + glow ring */}
      <div style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height={150}>
          <RadialBarChart
            innerRadius="62%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={data}
          >
            <RadialBar
              dataKey="value"
              max={100}
              cornerRadius={10}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
            {/* background track */}
            <RadialBar
              dataKey={() => 100}
              max={100}
              cornerRadius={10}
              fill="var(--bg-raise)"
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* canvas glow ring */}
        <GlowRing score={s} color={scoreColorResolved} />

        {/* score number + label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "0.5rem",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "2.6rem",
              fontWeight: 800,
              lineHeight: 1,
              color: scoreColorResolved,
              animation: "countUp 0.6s ease forwards",
              textShadow: `0 0 20px color-mix(in srgb, ${scoreColorResolved} 50%, transparent)`,
            }}
          >
            {animated}
          </span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              marginTop: 2,
              color: scoreColorResolved,
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* penalty chips */}
      {breakdown && Object.keys(breakdown).length > 0 && (
        <div
          style={{
            marginTop: "0.85rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            textAlign: "left",
          }}
        >
          {Object.entries(breakdown).map(([k, v]) => (
            <PenaltyChip key={k} label={k} value={v} />
          ))}
        </div>
      )}
    </div>
  );
}
