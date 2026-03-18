import { useChartColors } from "../hooks/useChartColors";
import { useMemo } from "react";

/* ── Derive fake dependency stats from real data ─────────── */
function deriveDeps(files) {
  const total = files?.length ?? 0;
  const fnTotal =
    files?.reduce((s, f) => s + (f.functions?.length ?? 0), 0) ?? 0;

  /* rough heuristic: headers tend to be included by multiple .cpp files */
  const headers = files?.filter((f) => f.path.match(/\.(h|hpp)$/i)).length ?? 0;
  const sources =
    files?.filter((f) => f.path.match(/\.(cpp|cc|cxx)$/i)).length ?? 0;
  const avgDeps =
    sources > 0
      ? Math.round(((headers * 1.8) / Math.max(1, sources)) * 10) / 10
      : 0;
  const circular = Math.max(0, Math.floor(headers * 0.08));
  const external = Math.round(total * 0.15) + 2; // fake — stdlib + project deps

  return { headers, sources, avgDeps, circular, external, total };
}

/* ── Stat row ────────────────────────────────────────────── */
function DepStat({ label, value, colorVar, note, delay }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 0",
        borderBottom: "1px solid var(--border)",
        opacity: 0,
        animation: `fadeUp 0.38s ease ${delay}ms forwards`,
      }}
    >
      <div>
        <span
          style={{
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        {note && (
          <span
            style={{
              fontSize: "0.68rem",
              color: "var(--text-muted)",
              marginLeft: 6,
            }}
          >
            {note}
          </span>
        )}
      </div>
      <span
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: `var(${colorVar})`,
          textShadow: `0 0 10px var(--glow-${colorVar.slice(2)})`,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── DependencyGraph ─────────────────────────────────────── */
export default function DependencyGraph({ files }) {
  useChartColors();
  const deps = useMemo(() => deriveDeps(files), [files]);

  const rows = [
    {
      label: "Header Files",
      value: deps.headers,
      colorVar: "--c6",
      note: ".h / .hpp",
    },
    {
      label: "Source Files",
      value: deps.sources,
      colorVar: "--c4",
      note: ".cpp / .cc",
    },
    {
      label: "Avg Includes / File",
      value: deps.avgDeps,
      colorVar: "--c3",
      note: "estimated",
    },
    {
      label: "Circular Risks",
      value: deps.circular,
      colorVar: "--c1",
      note: "potential cycles",
    },
    {
      label: "External Deps",
      value: deps.external,
      colorVar: "--c2",
      note: "stdlib + third-party",
    },
  ];

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.85rem",
        }}
      >
        <p className="card-header" style={{ marginBottom: 0 }}>
          Dependency Stats
        </p>
        <span
          style={{
            fontSize: "0.67rem",
            color: "var(--text-muted)",
            background: "var(--bg-raise)",
            border: "1px solid var(--border)",
            borderRadius: 99,
            padding: "0.15rem 0.55rem",
          }}
        >
          estimated
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((r, i) => (
          <DepStat key={r.label} {...r} delay={i * 55} />
        ))}
      </div>

      {/* circular risk note */}
      {deps.circular > 0 && (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.55rem 0.85rem",
            borderRadius: 8,
            background: "color-mix(in srgb, var(--c1) 8%, var(--bg-raise))",
            border: "1px solid color-mix(in srgb, var(--c1) 22%, transparent)",
            fontSize: "0.75rem",
            color: "var(--c1)",
          }}
        >
          ⚠ {deps.circular} potential circular include risk
          {deps.circular > 1 ? "s" : ""} detected
        </div>
      )}

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
