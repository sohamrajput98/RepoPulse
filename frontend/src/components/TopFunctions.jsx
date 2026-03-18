import { useChartColors } from "../hooks/useChartColors";

/* ── Severity from CC value ──────────────────────────────── */
function getSeverity(cc, colors) {
  if (cc > 15)
    return {
      colorVar: "--c1",
      color: colors.c1,
      glow: colors.glowC1,
      label: "Critical",
    };
  if (cc > 10)
    return {
      colorVar: "--c3",
      color: colors.c3,
      glow: colors.glowC3,
      label: "High",
    };
  if (cc > 6)
    return {
      colorVar: "--c5",
      color: colors.c5,
      glow: colors.glowC5,
      label: "Medium",
    };
  return {
    colorVar: "--c2",
    color: colors.c2,
    glow: colors.glowC2,
    label: "Low",
  };
}

/* ── Ranked function card ────────────────────────────────── */
function FnCard({ fn, rank, colors, delay }) {
  const sev = getSeverity(fn.complexity, colors);
  const barW = Math.min(100, (fn.complexity / 20) * 100);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 0.9rem",
        borderRadius: 10,
        background: "var(--bg-raise)",
        border: "1px solid var(--border)",
        /* neon left-border accent */
        borderLeft: `3px solid ${sev.color}`,
        opacity: 0,
        animation: `fadeUp 0.45s ease ${delay}ms forwards`,
        transition: "box-shadow 0.18s ease, transform 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 14px ${sev.glow}`;
        e.currentTarget.style.transform = "translateX(2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      {/* rank number */}
      <span
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "1rem",
          fontWeight: 800,
          color: "var(--text-muted)",
          minWidth: 22,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        #{rank}
      </span>

      {/* name + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "62%",
            }}
          >
            {fn.name}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "34%",
            }}
          >
            {fn.file}
          </span>
        </div>

        {/* complexity progress bar */}
        <div
          style={{
            height: 4,
            borderRadius: 99,
            background: "var(--bg-card)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 99,
              width: `${barW}%`,
              background: sev.color,
              boxShadow: `0 0 6px ${sev.glow}`,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </div>

      {/* CC badge */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.15rem",
            fontWeight: 800,
            color: sev.color,
            lineHeight: 1,
            textShadow: `0 0 10px ${sev.glow}`,
          }}
        >
          {fn.complexity}
        </span>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: sev.color,
            lineHeight: 1,
          }}
        >
          {sev.label}
        </span>
      </div>
    </div>
  );
}

/* ── TopFunctions ────────────────────────────────────────── */
export default function TopFunctions({ files }) {
  const colors = useChartColors();
  if (!files?.length) return null;

  const fns = files
    .flatMap((f) =>
      (f.functions ?? []).map((fn) => ({
        ...fn,
        file: f.path.split(/[\\/]/).pop(),
      })),
    )
    .sort((a, b) => b.complexity - a.complexity)
    .slice(0, 8);

  if (!fns.length)
    return (
      <div
        className="card"
        style={{
          padding: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          No function data available.
        </p>
      </div>
    );

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <p className="card-header">Top Complex Functions</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {fns.map((fn, i) => (
          <FnCard
            key={`${fn.name}-${fn.file}-${i}`}
            fn={fn}
            rank={i + 1}
            colors={colors}
            delay={i * 50}
          />
        ))}
      </div>

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
