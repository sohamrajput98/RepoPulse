import { useState } from "react";
import { getAISuggestions } from "../utils/insights";

/* ── Severity config ─────────────────────────────────────── */
const SEV = {
  high: {
    colorVar: "--c1",
    glowVar: "--glow-c1",
    label: "High",
    icon: "🔴",
    order: 0,
  },
  medium: {
    colorVar: "--c3",
    glowVar: "--glow-c3",
    label: "Medium",
    icon: "🟠",
    order: 1,
  },
  low: {
    colorVar: "--c4",
    glowVar: "--glow-c4",
    label: "Low",
    icon: "🔵",
    order: 2,
  },
};

/* ── Single suggestion card ──────────────────────────────── */
function SuggestionCard({ s, index }) {
  const sev = SEV[s.level] ?? SEV.low;
  const color = `var(${sev.colorVar})`;
  const glow = `var(${sev.glowVar})`;

  return (
    <div
      style={{
        display: "flex",
        gap: "0.85rem",
        alignItems: "flex-start",
        padding: "0.85rem 1rem",
        borderRadius: 10,
        background: "var(--bg-raise)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${color}`,
        opacity: 0,
        animation: `fadeUp 0.4s ease ${index * 40}ms forwards`,
        transition: "box-shadow 0.18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 12px ${glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>
        {s.icon}
      </span>
      <p
        style={{
          fontSize: "0.84rem",
          color: "var(--text-primary)",
          lineHeight: 1.55,
          flex: 1,
        }}
      >
        {s.text}
      </p>
      <span
        style={{
          fontSize: "0.62rem",
          fontWeight: 700,
          flexShrink: 0,
          marginTop: 3,
          color: "var(--text-muted)",
        }}
      >
        #{index + 1}
      </span>
    </div>
  );
}

/* ── Collapsible severity section ────────────────────────── */
function SeveritySection({ level, items, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const sev = SEV[level];
  const color = `var(${sev.colorVar})`;
  const glow = `var(${sev.glowVar})`;
  if (!items.length) return null;

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      {/* section toggle header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: "0.6rem 0.9rem",
          borderRadius: 10,
          marginBottom: open ? 8 : 0,
          background: `color-mix(in srgb, ${color} 8%, var(--bg-raise))`,
          border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`,
          cursor: "pointer",
          transition: "box-shadow 0.18s ease",
          boxShadow: open ? `0 0 14px ${glow}` : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 16px ${glow}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = open ? `0 0 14px ${glow}` : "none";
        }}
      >
        <span style={{ fontSize: "0.9rem" }}>{sev.icon}</span>
        <span
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "0.88rem",
            fontWeight: 700,
            color,
          }}
        >
          {sev.label} Priority
        </span>
        {/* count badge */}
        <span
          style={{
            padding: "0.12rem 0.5rem",
            borderRadius: 99,
            fontSize: "0.7rem",
            fontWeight: 700,
            background: `color-mix(in srgb, ${color} 18%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 32%, transparent)`,
            color,
          }}
        >
          {items.length}
        </span>
        {/* chevron */}
        <span
          style={{
            marginLeft: "auto",
            color: "var(--text-muted)",
            fontSize: "0.72rem",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.22s ease",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>

      {/* animated collapse */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? `${items.length * 100}px` : "0px",
          opacity: open ? 1 : 0,
          transition:
            "max-height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.45rem",
            paddingBottom: 4,
          }}
        >
          {items.map((s, i) => (
            <SuggestionCard key={i} s={s} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AISuggestions ───────────────────────────────────────── */
export default function AISuggestions({ files, score }) {
  const all = getAISuggestions(files ?? [], score ?? 100);
  const high = all.filter((s) => s.level === "high");
  const medium = all.filter((s) => s.level === "medium");
  const low = all.filter((s) => s.level === "low");

  if (!all.length) return null;

  return (
    <div className="card" style={{ overflow: "hidden", padding: "1.25rem" }}>
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>🤖</span>
        <p className="card-header" style={{ marginBottom: 0 }}>
          AI Suggestions
        </p>
        <span className="badge badge-accent">{all.length}</span>
        {/* severity chips */}
        <div style={{ display: "flex", gap: 5, marginLeft: 4 }}>
          {[
            { level: "high", count: high.length },
            { level: "medium", count: medium.length },
            { level: "low", count: low.length },
          ]
            .filter((x) => x.count > 0)
            .map(({ level, count }) => {
              const sev = SEV[level];
              const color = `var(${sev.colorVar})`;
              return (
                <span
                  key={level}
                  style={{
                    padding: "0.1rem 0.45rem",
                    borderRadius: 99,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    background: `color-mix(in srgb, ${color} 12%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
                    color,
                  }}
                >
                  {sev.icon} {count}
                </span>
              );
            })}
        </div>
      </div>

      {/* grouped sections */}
      <SeveritySection level="high" items={high} defaultOpen={true} />
      <SeveritySection level="medium" items={medium} defaultOpen={true} />
      <SeveritySection level="low" items={low} defaultOpen={false} />

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
