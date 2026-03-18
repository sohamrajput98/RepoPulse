import { useChartColors } from "../hooks/useChartColors";

/* ── Grade config ────────────────────────────────────────── */
const GRADE_CONFIG = {
  A: {
    colorVar: "--score-excellent",
    glowVar: "--glow-c2",
    label: "Excellent",
  },
  B: { colorVar: "--score-good", glowVar: "--glow-c2", label: "Good" },
  C: { colorVar: "--score-fair", glowVar: "--glow-c3", label: "Fair" },
  D: { colorVar: "--score-poor", glowVar: "--glow-c1", label: "Poor" },
  F: { colorVar: "--score-critical", glowVar: "--glow-c1", label: "Critical" },
};

function resolveGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 50) return "D";
  return "F";
}

export default function QualityGrade({ score }) {
  /* re-render on palette/theme change */
  useChartColors();

  const s = score ?? 0;
  const letter = resolveGrade(s);
  const cfg = GRADE_CONFIG[letter];
  const color = `var(${cfg.colorVar})`;
  const glow = `var(${cfg.glowVar})`;
  const SIZE = 104;
  const THICK = 5;

  return (
    <div
      className="card"
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "0.5rem",
      }}
    >
      <p className="card-header" style={{ marginBottom: 0 }}>
        Quality Grade
      </p>

      {/* neon glow ring via box-shadow layers */}
      <div
        style={{
          position: "relative",
          width: SIZE,
          height: SIZE,
          marginTop: "0.5rem",
        }}
      >
        {/* outer glow ring — animated */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${THICK}px solid ${color}`,
            boxShadow: [
              `0 0 0 1px color-mix(in srgb, ${color} 20%, transparent)`,
              `0 0 18px 3px ${glow}`,
              `0 0 36px 6px color-mix(in srgb, ${glow} 40%, transparent)`,
              `inset 0 0 14px color-mix(in srgb, ${glow} 16%, transparent)`,
            ].join(", "),
            animation: "gradeGlow 2.5s ease-in-out infinite alternate",
          }}
        />

        {/* inner subtle fill */}
        <div
          style={{
            position: "absolute",
            inset: THICK + 4,
            borderRadius: "50%",
            background: `radial-gradient(circle, color-mix(in srgb, ${glow} 12%, transparent) 0%, transparent 70%)`,
          }}
        />

        {/* grade letter */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "3.4rem",
              fontWeight: 800,
              lineHeight: 1,
              color,
              /* neon text glow */
              textShadow: [
                `0 0 12px ${glow}`,
                `0 0 28px color-mix(in srgb, ${glow} 50%, transparent)`,
                `0 0 52px color-mix(in srgb, ${glow} 25%, transparent)`,
              ].join(", "),
              animation:
                "gradeIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            {letter}
          </span>
        </div>
      </div>

      {/* label with neon text shadow */}
      <span
        style={{
          fontSize: "0.78rem",
          fontWeight: 700,
          color,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          textShadow: `0 0 10px color-mix(in srgb, ${glow} 55%, transparent)`,
        }}
      >
        {cfg.label}
      </span>

      <p
        style={{
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          lineHeight: 1.4,
          marginTop: 2,
        }}
      >
        Based on complexity,
        <br />
        smells &amp; maintainability
      </p>

      <style>{`
                @keyframes gradeGlow {
                    from {
                        box-shadow:
                            0 0 10px 2px ${glow},
                            inset 0 0 8px color-mix(in srgb, ${glow} 10%, transparent);
                    }
                    to {
                        box-shadow:
                            0 0 28px 8px ${glow},
                            0 0 54px 12px color-mix(in srgb, ${glow} 30%, transparent),
                            inset 0 0 22px color-mix(in srgb, ${glow} 20%, transparent);
                    }
                }
                @keyframes gradeIn {
                    from { opacity: 0; transform: scale(0.5) rotate(-8deg); }
                    to   { opacity: 1; transform: scale(1) rotate(0deg); }
                }
            `}</style>
    </div>
  );
}
