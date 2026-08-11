import { useCountUp } from "../hooks/useCountUp";
import { IconFiles, IconLines, IconFunctions, IconSmells } from "./icons";

/* ── Per-stat config ─────────────────────────────────────── */
const STATS = [
  {
    key: "totalFiles",
    label: "Files",
    icon: IconFiles,
    colorVar: "--c4",
  },
  {
    key: "totalLOC",
    label: "Lines",
    icon: IconLines,
    colorVar: "--c2",
  },
  {
    key: "totalFunctions",
    label: "Functions",
    icon: IconFunctions,
    colorVar: "--c6",
  },
  {
    key: "totalSmells",
    label: "Smells",
    icon: IconSmells,
    colorVar: "--c1",
  },
];

/* ── Single stat card ────────────────────────────────────── */
function StatCard({ label, value, icon: IconComponent, colorVar, delay }) {
  const animated = useCountUp(value ?? 0, 1000);

  return (
    <div
      className="card"
      style={{
        padding: "1.1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        /* colored top-border accent */
        borderTop: `3px solid var(${colorVar})`,
        /* subtle top glow strip */
        boxShadow: `var(--shadow-card), 0 -1px 0 0 var(${colorVar})`,
        /* staggered fade-up */
        opacity: 0,
        animation: `fadeUp 0.5s ease ${delay}ms forwards`,
        transition: "box-shadow 0.22s ease, transform 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `var(--shadow-card), 0 -1px 0 0 var(${colorVar})`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `var(--shadow-card), 0 -1px 0 0 var(${colorVar})`;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* label + icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="card-header" style={{ marginBottom: 0 }}>
          {label}
        </span>
        <IconComponent size={20} style={{ color: `var(${colorVar})` }} />
      </div>

      {/* animated count value */}
      <span
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "2.1rem",
          fontWeight: 700,
          lineHeight: 1,
          color: `var(${colorVar})`,
          animation: "countUp 0.6s ease forwards",
        }}
      >
        {animated.toLocaleString()}
      </span>
    </div>
  );
}

/* ── RepoOverview ────────────────────────────────────────── */
export default function RepoOverview({ summary }) {
  if (!summary) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "0.85rem",
      }}
    >
      {STATS.map((s, i) => (
        <StatCard
          key={s.key}
          label={s.label}
          icon={s.icon}
          value={summary[s.key]}
          colorVar={s.colorVar}
          delay={i * 65}
        />
      ))}

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes countUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
