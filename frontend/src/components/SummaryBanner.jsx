import LastAnalyzed from "./LastAnalyzed";

/* ── Chip config ─────────────────────────────────────────── */
const CHIPS = [
  { icon: "🗂", key: "totalFiles", suffix: " files", colorVar: "--c4" },
  { icon: "🔍", key: "totalSmells", suffix: " smells", colorVar: "--c1" },
  { icon: "⚙️", key: "totalFunctions", suffix: " functions", colorVar: "--c6" },
  { icon: "📊", key: "avg", suffix: " avg CC", colorVar: "--c3" },
];

/* ── Pill chip ───────────────────────────────────────────── */
function StatPill({ icon, value, suffix, colorVar, delay }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.32rem 0.85rem",
        borderRadius: 99,
        background: `color-mix(in srgb, var(${colorVar}) 10%, var(--bg-raise))`,
        border: `1px solid color-mix(in srgb, var(${colorVar}) 28%, transparent)`,
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        opacity: 0,
        animation: `fadeIn 0.4s ease ${delay}ms forwards`,
        transition: "box-shadow 0.2s ease, transform 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 12px color-mix(in srgb, var(${colorVar}) 40%, transparent)`;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span style={{ fontSize: "0.88rem", lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontWeight: 700,
          color: `var(${colorVar})`,
          fontSize: "0.85rem",
        }}
      >
        {value ?? "—"}
      </span>
      <span
        style={{
          color: "var(--text-muted)",
          fontSize: "0.75rem",
          fontWeight: 400,
        }}
      >
        {suffix}
      </span>
    </span>
  );
}

/* ── SummaryBanner ───────────────────────────────────────── */
export default function SummaryBanner({ summary, generatedAt }) {
  if (!summary) return null;
  const avg = summary.averageComplexity?.toFixed(1) ?? "—";

  const values = {
    totalFiles: summary.totalFiles,
    totalSmells: summary.totalSmells,
    totalFunctions: summary.totalFunctions,
    avg,
  };

  return (
    <div
      className="card"
      style={{
        padding: "0.7rem 1.25rem",
        marginBottom: "1.25rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.55rem",
        /* subtle top accent line */
        borderTop: "2px solid var(--accent)",
        boxShadow: "var(--shadow-card), 0 -1px 0 0 var(--accent)",
      }}
    >
      {/* ── pill chips strip ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {CHIPS.map((c, i) => (
          <StatPill
            key={c.key}
            icon={c.icon}
            value={values[c.key]}
            suffix={c.suffix}
            colorVar={c.colorVar}
            delay={i * 55}
          />
        ))}
      </div>

      {/* ── last analyzed inline ── */}
      <LastAnalyzed generatedAt={generatedAt} />

      <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
