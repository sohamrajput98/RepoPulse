import { useReport } from "../../context/ReportContext";
import SmellsPieChart from "../../components/SmellsPieChart";
import InsightsPanel from "../../components/InsightsPanel";

/* ── Summary strip ───────────────────────────────────────── */
function SmellSummaryStrip({ files }) {
  const counts = {};
  files?.forEach((f) =>
    f.smells?.forEach((s) => {
      const key = s.split(":")[0];
      counts[key] = (counts[key] || 0) + 1;
    }),
  );
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  const colorVars = ["--c1", "--c3", "--c5", "--c4", "--c6"];

  /* merge Total + sorted into one array so they all share the same map */
  const items = [
    { type: "Total Smells", count: total, colorVar: "--c1", isTotal: true },
    ...sorted.map(([type, count], i) => ({
      type,
      count,
      colorVar: colorVars[i],
      isTotal: false,
    })),
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "0.65rem",
      }}
    >
      {items.map(({ type, count, colorVar, isTotal }) => (
        <div
          key={type}
          className="card"
          style={{
            padding: "0.7rem 0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            borderLeft: `3px solid var(${colorVar})`,
          }}
        >
          <span
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: isTotal ? "1.7rem" : "1.5rem",
              fontWeight: isTotal ? 800 : 700,
              color: `var(${colorVar})`,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontSize: "0.73rem",
              color: isTotal ? "var(--text-muted)" : "var(--text-secondary)",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 600,
              wordBreak: "break-word",
              minWidth: 0,
            }}
          >
            {type}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Top smell files ─────────────────────────────────────── */
function TopSmellFiles({ files }) {
  const top = [...files]
    .filter((f) => f.smells?.length > 0)
    .sort((a, b) => b.smells.length - a.smells.length)
    .slice(0, 8);

  if (!top.length) return null;
  const max = top[0].smells.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
      <p className="card-header" style={{ marginBottom: 0 }}>
        Files with Most Smells
      </p>
      {top.map((f, i) => {
        const name = f.path.split(/[\\/]/).pop();
        const pct = Math.round((f.smells.length / max) * 100);
        return (
          <div key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  fontFamily: "Fira Code, monospace",
                  fontSize: "0.78rem",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "68%",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--c1)",
                  flexShrink: 0,
                  marginLeft: 8,
                }}
              >
                {f.smells.length} smell{f.smells.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 99,
                background: "var(--bg-raise)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  width: `${pct}%`,
                  background: "var(--c1)",
                  boxShadow: "0 0 6px var(--glow-c1)",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Smells tab ──────────────────────────────────────────── */
export default function Smells() {
  const { report } = useReport();
  const files = report?.files ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Row 1: summary strip */}
      <div
        style={{ opacity: 0, animation: "smellsFade 0.45s ease 0ms forwards" }}
      >
        <SmellSummaryStrip files={files} />
      </div>

      {/* Row 2: full-height two-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "1rem",
          /* key: both columns fill the same row height */
          alignItems: "stretch",
          opacity: 0,
          animation: "smellsFade 0.45s ease 80ms forwards",
        }}
      >
        {/* LEFT — pie + files bar, stacked inside a single card */}
        <div
          className="card"
          style={{
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Pie section */}
          <div>
            <p className="card-header">Smell Distribution</p>
            <SmellsPieChart files={files} />
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "var(--border)",
              margin: "0 -0.25rem",
            }}
          />

          {/* Files bar section — grows to fill remaining left-card height */}
          <div style={{ flex: 1 }}>
            <TopSmellFiles files={files} />
          </div>
        </div>

        {/* RIGHT — InsightsPanel stretches to full row height via CSS */}
        <div
          style={{ display: "flex", flexDirection: "column", height: "650px" }}
        >
          <InsightsPanel files={files} />
        </div>
      </div>

      <style>{`
        @keyframes smellsFade {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
