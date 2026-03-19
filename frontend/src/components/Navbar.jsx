import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  usePalette,
  DARK_PALETTES,
  LIGHT_PALETTES,
} from "../context/PaletteContext";
import { useReport } from "../context/ReportContext";

/* ── Tab definitions ─────────────────────────────────────── */
const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "complexity", label: "Complexity", icon: "🔬" },
  { id: "smells", label: "Smells", icon: "🧠" },
  { id: "files", label: "Files", icon: "📁" },
  { id: "insights", label: "Insights", icon: "💡" },
];

/* ── Palette dot swatch ──────────────────────────────────── */
function Swatch({ colors }) {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {colors.map((c, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: c,
            boxShadow: `0 0 4px ${c}88`,
          }}
        />
      ))}
    </span>
  );
}

/* ── Palette dropdown ────────────────────────────────────── */
function PalettePicker({ dark }) {
  const { palette, setPalette } = usePalette();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const palettes = dark ? DARK_PALETTES : LIGHT_PALETTES;
  const current = palettes.find((p) => p.id === palette) ?? palettes[0];

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="btn-ghost"
        onClick={() => setOpen((o) => !o)}
        title="Switch colour palette"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.8rem",
        }}
      >
        <Swatch colors={current.swatch} />
        <span style={{ fontSize: "0.75rem" }}>{current.label}</span>
        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: 12,
            padding: "0.4rem",
            minWidth: 160,
            zIndex: 200,
            boxShadow: "var(--shadow-card)",
            animation: "scaleIn 0.18s ease",
          }}
        >
          {palettes.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPalette(p.id);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "0.45rem 0.7rem",
                borderRadius: 8,
                border: "none",
                background:
                  palette === p.id ? "var(--bg-raise)" : "transparent",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "0.82rem",
                fontWeight: palette === p.id ? 600 : 400,
              }}
            >
              <Swatch colors={p.swatch} />
              {p.label}
              {palette === p.id && (
                <span
                  style={{
                    marginLeft: "auto",
                    color: "var(--accent)",
                    fontSize: "0.7rem",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Navbar ─────────────────────────────────────────── */
export default function Navbar({ onPrint }) {
  const [dark, setDark] = useDarkMode();
  const { report, refresh, isStale } = useReport();
  const navigate = useNavigate();

  const repoName = report?.summary?.repoName ?? "Local Report";

  return (
    <nav
      className="no-print"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "color-mix(in srgb, var(--bg-card) 85%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem",
        height: 56,
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {/* ── LEFT — logo ── */}
      <button
        onClick={() => navigate("/analyze")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          fontFamily: "Orbitron, sans-serif",
          fontWeight: 800,
          fontSize: "1.15rem",
          letterSpacing: "-0.01em",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)",
          flexShrink: 0,
          padding: 0,
        }}
      >
        <span style={{ color: "var(--accent)" }}>⚡</span>
        RepoPulse
      </button>

      {/* ── CENTER — tab nav ── */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div className="tab-bar" style={{ display: "flex", gap: 2 }}>
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={`/dashboard/${tab.id}`}
              className={({ isActive }) =>
                `tab-item${isActive ? " active" : ""}`
              }
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span style={{ fontSize: "0.8rem" }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ── RIGHT — controls ── */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
      >
        {/* Repo chip */}
        {report && (
          <span
            className="badge badge-neutral"
            style={{
              fontSize: "0.72rem",
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={repoName}
          >
            📁 {repoName}
            {isStale && (
              <span style={{ color: "var(--score-fair)", marginLeft: 4 }}>
                ⚠
              </span>
            )}
          </span>
        )}

        {/* Palette switcher */}
        <PalettePicker dark={dark} />

        {/* Theme toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="btn-ghost"
          title={dark ? "Light mode" : "Dark mode"}
          style={{ padding: "0.35rem 0.6rem", fontSize: "0.9rem" }}
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Refresh */}
        <button
          onClick={() => refresh()}
          className="btn-ghost no-print"
          style={{ fontSize: "0.8rem" }}
          title="Refresh report"
        >
          ↻
        </button>

        {/* Export PDF */}
        {onPrint && (
          <button
            onClick={onPrint}
            className="btn-ghost no-print"
            style={{ fontSize: "0.8rem" }}
          >
            Export PDF
          </button>
        )}
      </div>
    </nav>
  );
}
