import { useState } from "react";
import {
  getUnusedVarHints,
  getOptimizationHints,
  getDeadCodeHints,
  getMagicNumbers,
  getDuplicateFunctions,
} from "../utils/insights";

/* ── Tab config ──────────────────────────────────────────── */
const TABS = [
  { label: "Optimization", colorVar: "--c3", icon: "⚡" },
  { label: "Unused Vars", colorVar: "--c5", icon: "🔇" },
  { label: "Dead Code", colorVar: "--c1", icon: "💀" },
  { label: "Magic #s", colorVar: "--c4", icon: "🔢" },
  { label: "Duplicates", colorVar: "--c6", icon: "🔁" },
];

/* ── Hint type badge ─────────────────────────────────────── */
function TypeBadge({ label }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.12rem 0.5rem",
        borderRadius: 99,
        fontSize: "0.65rem",
        fontWeight: 700,
        background: "color-mix(in srgb, var(--c3) 12%, var(--bg-raise))",
        border: "1px solid color-mix(in srgb, var(--c3) 25%, transparent)",
        color: "var(--c3)",
        whiteSpace: "nowrap",
        marginLeft: 6,
      }}
    >
      {label}
    </span>
  );
}

/* ── Hint list ───────────────────────────────────────────── */
function HintList({ items, emptyMsg, tabColorVar }) {
  if (!items?.length)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        {emptyMsg} 🎉
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {items.map((h, i) => (
        <div
          key={i}
          style={{
            padding: "0.75rem 0.9rem",
            borderRadius: 10,
            background: "var(--bg-raise)",
            border: "1px solid var(--border)",
            borderLeft: `3px solid var(${tabColorVar})`,
            opacity: 0,
            animation: `fadeUp 0.38s ease ${i * 45}ms forwards`,
          }}
        >
          {/* mono file + function path */}
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--accent)",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <span>{h.file}</span>
            {h.fn && (
              <>
                <span style={{ color: "var(--text-muted)", margin: "0 2px" }}>
                  →
                </span>
                <span style={{ color: "var(--text-primary)" }}>{h.fn}</span>
              </>
            )}
            {h.type && <TypeBadge label={h.type} />}
            {h.files && (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  marginLeft: 4,
                }}
              >
                also in {h.files[1]}
              </span>
            )}
          </p>

          {/* hint message */}
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            {h.message}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── InsightsPanel ───────────────────────────────────────── */
export default function InsightsPanel({ files }) {
  const [tab, setTab] = useState(0);

  const opt = getOptimizationHints(files ?? []);
  const unused = getUnusedVarHints(files ?? []);
  const dead = getDeadCodeHints(files ?? []);
  const magic = getMagicNumbers(files ?? []);
  const dupes = getDuplicateFunctions(files ?? []);

  const counts = [
    opt.length,
    unused.length,
    dead.length,
    magic.length,
    dupes.length,
  ];
  const content = [opt, unused, dead, magic, dupes];
  const msgs = [
    "No optimization issues",
    "No unused variable hints",
    "No dead code detected",
    "No magic numbers found",
    "No duplicate functions",
  ];

  const activeColor = `var(${TABS[tab].colorVar})`;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <p className="card-header" style={{ padding: "1.25rem 1.25rem 0" }}>
        Static Analysis Insights
      </p>

      {/* tab pill bar */}
      <div
        style={{
          display: "flex",
          gap: 5,
          padding: "0.75rem 1.25rem",
          overflowX: "auto",
          flexWrap: "wrap",
        }}
      >
        {TABS.map((t, i) => {
          const isActive = tab === i;
          const color = `var(${t.colorVar})`;
          return (
            <button
              key={i}
              onClick={() => setTab(i)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.3rem 0.75rem",
                borderRadius: 99,
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                border: isActive
                  ? `1px solid color-mix(in srgb, ${color} 40%, transparent)`
                  : "1px solid var(--border)",
                background: isActive
                  ? `color-mix(in srgb, ${color} 14%, var(--bg-raise))`
                  : "var(--bg-raise)",
                color: isActive ? color : "var(--text-secondary)",
                boxShadow: isActive
                  ? `0 0 10px color-mix(in srgb, ${color} 30%, transparent)`
                  : "none",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "0.78rem" }}>{t.icon}</span>
              {t.label}
              {counts[i] > 0 && (
                <span
                  style={{
                    padding: "0 0.38rem",
                    borderRadius: 99,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    background: isActive
                      ? `color-mix(in srgb, ${color} 22%, transparent)`
                      : "var(--bg-card)",
                    color: isActive ? color : "var(--text-muted)",
                  }}
                >
                  {counts[i]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* divider */}
      <div
        style={{ height: 1, background: "var(--border)", margin: "0 1.25rem" }}
      />

      {/* content */}
      <div style={{ padding: "0.85rem 1.25rem 1.25rem" }}>
        <HintList
          key={tab} /* remount on tab change to re-trigger animations */
          items={content[tab]}
          emptyMsg={msgs[tab]}
          tabColorVar={TABS[tab].colorVar}
        />
      </div>

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
