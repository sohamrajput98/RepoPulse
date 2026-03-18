import { useState } from "react";
import { useReport } from "../../context/ReportContext";
import { getAISuggestions } from "../../utils/insights";

/* ── Severity config ─────────────────────────────────────── */
const SEVERITY = {
  high: {
    label: "High",
    colorVar: "--c1",
    glowVar: "--glow-c1",
    icon: "🔴",
    order: 0,
  },
  medium: {
    label: "Medium",
    colorVar: "--c3",
    glowVar: "--glow-c3",
    icon: "🟠",
    order: 1,
  },
  low: {
    label: "Low",
    colorVar: "--c4",
    glowVar: "--glow-c4",
    icon: "🔵",
    order: 2,
  },
};

/* ── Single suggestion card ──────────────────────────────── */
function SuggestionCard({ suggestion, index, delay }) {
  const sev = SEVERITY[suggestion.level] ?? SEVERITY.low;
  const color = `var(${sev.colorVar})`;

  return (
    <div
      className="card"
      style={{
        padding: "1rem 1.25rem",
        display: "flex",
        gap: "0.85rem",
        alignItems: "flex-start",
        borderLeft: `3px solid ${color}`,
        opacity: 0,
        animation: `fadeUp 0.4s ease ${delay}ms forwards`,
      }}
    >
      {/* icon */}
      <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>
        {suggestion.icon}
      </span>

      {/* text */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-primary)",
          lineHeight: 1.55,
          flex: 1,
        }}
      >
        {suggestion.text}
      </p>

      {/* index chip */}
      <span
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        #{index + 1}
      </span>
    </div>
  );
}

/* ── Severity section ────────────────────────────────────── */
function SeveritySection({
  level,
  suggestions,
  baseDelay,
  collapsed,
  onToggle,
}) {
  const sev = SEVERITY[level];
  const color = `var(${sev.colorVar})`;
  const count = suggestions.length;

  if (!count) return null;

  return (
    <div
      style={{
        opacity: 0,
        animation: `fadeUp 0.45s ease ${baseDelay}ms forwards`,
      }}
    >
      {/* section header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          borderRadius: 12,
          marginBottom: 8,
          background: `color-mix(in srgb, ${color} 8%, var(--bg-raise))`,
          border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s",
          boxShadow: !collapsed ? `0 0 16px var(${sev.glowVar})` : "none",
        }}
      >
        <span style={{ fontSize: "1rem" }}>{sev.icon}</span>

        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            color,
          }}
        >
          {sev.label} Priority
        </span>

        {/* count badge */}
        <span
          style={{
            marginLeft: 4,
            padding: "0.15rem 0.55rem",
            borderRadius: 99,
            fontSize: "0.72rem",
            fontWeight: 700,
            background: `color-mix(in srgb, ${color} 20%, transparent)`,
            color,
            border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
          }}
        >
          {count} issue{count !== 1 ? "s" : ""}
        </span>

        {/* collapse arrow */}
        <span
          style={{
            marginLeft: "auto",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>

      {/* cards */}
      {!collapsed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            marginBottom: "0.5rem",
          }}
        >
          {suggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              suggestion={s}
              index={i}
              delay={baseDelay + 60 + i * 35}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── AI tab ──────────────────────────────────────────────── */
export default function AI() {
  const { report } = useReport();
  const files = report?.files ?? [];
  const score = report?.summary?.healthScore ?? 100;

  const all = getAISuggestions(files, score);
  const high = all.filter((s) => s.level === "high");
  const medium = all.filter((s) => s.level === "medium");
  const low = all.filter((s) => s.level === "low");

  const [collapsed, setCollapsed] = useState({
    high: false,
    medium: false,
    low: true,
  });
  const toggle = (level) => setCollapsed((c) => ({ ...c, [level]: !c[level] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* ── Header strip ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          opacity: 0,
          animation: "fadeUp 0.4s ease 0ms forwards",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 2,
            }}
          >
            🤖 AI Suggestions
          </h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {all.length} suggestion{all.length !== 1 ? "s" : ""} generated from
            static analysis
          </p>
        </div>

        {/* severity summary chips */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { level: "high", count: high.length },
            { level: "medium", count: medium.length },
            { level: "low", count: low.length },
          ].map(({ level, count }) => {
            if (!count) return null;
            const sev = SEVERITY[level];
            const color = `var(${sev.colorVar})`;
            return (
              <span
                key={level}
                style={{
                  padding: "0.25rem 0.65rem",
                  borderRadius: 99,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  background: `color-mix(in srgb, ${color} 12%, transparent)`,
                  color,
                  border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
                }}
              >
                {sev.icon} {count} {sev.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Empty state ── */}
      {all.length === 0 && (
        <div
          className="card"
          style={{
            padding: "3.5rem",
            textAlign: "center",
            color: "var(--text-muted)",
            opacity: 0,
            animation: "fadeUp 0.4s ease 80ms forwards",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</p>
          <p style={{ fontWeight: 600 }}>No issues detected</p>
          <p style={{ fontSize: "0.82rem", marginTop: 4 }}>
            Your codebase looks clean — keep it up!
          </p>
        </div>
      )}

      {/* ── Severity sections ── */}
      <SeveritySection
        level="high"
        suggestions={high}
        baseDelay={80}
        collapsed={collapsed.high}
        onToggle={() => toggle("high")}
      />
      <SeveritySection
        level="medium"
        suggestions={medium}
        baseDelay={200}
        collapsed={collapsed.medium}
        onToggle={() => toggle("medium")}
      />
      <SeveritySection
        level="low"
        suggestions={low}
        baseDelay={320}
        collapsed={collapsed.low}
        onToggle={() => toggle("low")}
      />

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
