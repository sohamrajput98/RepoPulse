import { useReport } from "../../context/ReportContext";
import SmellsPieChart from "../../components/SmellsPieChart";
import InsightsPanel from "../../components/InsightsPanel";

/* ── Smell summary row ───────────────────────────────────── */
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

  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
        marginBottom: "1.25rem",
        opacity: 0,
        animation: "fadeUp 0.45s ease 0ms forwards",
      }}
    >
      {/* Total */}
      <div
        className="card"
        style={{
          padding: "0.65rem 1.1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          flex: "0 0 auto",
        }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--c1)",
            lineHeight: 1,
          }}
        >
          {total}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          Total Smells
        </span>
      </div>

      {/* Top smell types */}
      {sorted.map(([type, count], i) => (
        <div
          key={type}
          className="card"
          style={{
            padding: "0.65rem 1.1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: "1 1 130px",
            borderLeft: `3px solid var(${colorVars[i]})`,
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: `var(${colorVars[i]})`,
              lineHeight: 1,
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              wordBreak: "break-word",
            }}
          >
            {type}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Smells tab ──────────────────────────────────────────── */
export default function Smells() {
  const { report } = useReport();
  const files = report?.files ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* ── Summary strip ── */}
      <SmellSummaryStrip files={files} />

      {/* ── Two-column: PieChart left, InsightsPanel right ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* LEFT — pie chart */}
        <div
          style={{ opacity: 0, animation: "fadeUp 0.45s ease 80ms forwards" }}
        >
          <SmellsPieChart files={files} />

          {/* Per-file smell breakdown */}
          <div
            className="card"
            style={{ marginTop: "1rem", padding: "1.25rem" }}
          >
            <p className="card-header">Files with Most Smells</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[...files]
                .filter((f) => f.smells?.length > 0)
                .sort((a, b) => b.smells.length - a.smells.length)
                .slice(0, 6)
                .map((f, i) => {
                  const name = f.path.split(/[\\/]/).pop();
                  const pct = Math.min(100, (f.smells.length / 8) * 100);
                  return (
                    <div key={i}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "0.75rem",
                            color: "var(--text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "70%",
                          }}
                        >
                          {name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "var(--c1)",
                          }}
                        >
                          {f.smells.length} smell
                          {f.smells.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
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
          </div>
        </div>

        {/* RIGHT — insights panel */}
        <div
          style={{ opacity: 0, animation: "fadeUp 0.45s ease 160ms forwards" }}
        >
          <InsightsPanel files={files} />
        </div>
      </div>

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
