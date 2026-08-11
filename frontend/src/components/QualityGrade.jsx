import { useChartColors } from "../hooks/useChartColors";

/* ── Grade config ────────────────────────────────────────── */
const GRADE_CONFIG = {
  A: {
    colorVar: "--score-excellent",
    label: "Excellent",
  },
  B: { colorVar: "--score-good", label: "Good" },
  C: { colorVar: "--score-fair", label: "Fair" },
  D: { colorVar: "--score-poor", label: "Poor" },
  F: { colorVar: "--score-critical", label: "Critical" },
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
  const SIZE = 104;
  const THICK = 5;

  return (
    <div
      className="card"
      style={{
        height: "100%",
        padding: "0.25rem",
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
        {/* outer ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${THICK}px solid ${color}`,
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
              fontFamily: "Orbitron, sans-serif",
              fontSize: "3.4rem",
              fontWeight: 800,
              lineHeight: 1,
              color,
              animation:
                "gradeIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            {letter}
          </span>
        </div>
      </div>

      {/* label */}
      <span
        style={{
          fontSize: "0.78rem",
          fontWeight: 700,
          color,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
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
                @keyframes gradeIn {
                    from { opacity: 0; transform: scale(0.5) rotate(-8deg); }
                    to   { opacity: 1; transform: scale(1) rotate(0deg); }
                }
            `}</style>
    </div>
  );
}
