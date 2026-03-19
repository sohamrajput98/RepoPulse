import { useChartColors } from "../hooks/useChartColors";
import { useMemo } from "react";

/* ── Derive fake language split from real file data ──────── */
function deriveLanguageSplit(files) {
  if (!files?.length)
    return [
      { lang: "C++ Source", ext: ".cpp", pct: 62, colorVar: "--c4" },
      { lang: "C++ Header", ext: ".h", pct: 31, colorVar: "--c6" },
      { lang: "CMake", ext: "CMake", pct: 7, colorVar: "--c3" },
    ];

  /* count by extension */
  const counts = { cpp: 0, h: 0, other: 0 };
  let total = 0;
  files.forEach((f) => {
    const ext = f.path.split(".").pop()?.toLowerCase();
    if (ext === "cpp" || ext === "cc" || ext === "cxx") counts.cpp++;
    else if (ext === "h" || ext === "hpp") counts.h++;
    else counts.other++;
    total++;
  });

  if (total === 0) total = 1;
  const pCpp = Math.round((counts.cpp / total) * 100);
  const pH = Math.round((counts.h / total) * 100);
  const pOther = 100 - pCpp - pH;

  return [
    { lang: "C++ Source", ext: ".cpp/.cc", pct: pCpp, colorVar: "--c4" },
    { lang: "C++ Header", ext: ".h/.hpp", pct: pH, colorVar: "--c6" },
    { lang: "CMake/Other", ext: "misc", pct: pOther, colorVar: "--c3" },
  ].filter((l) => l.pct > 0);
}

/* ── Single language row ─────────────────────────────────── */
function LangRow({ lang, ext, pct, colorVar, delay }) {
  const color = `var(${colorVar})`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        opacity: 0,
        animation: `fadeUp 0.4s ease ${delay}ms forwards`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 5px ${color}88`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {lang}
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.68rem",
              color: "var(--text-muted)",
            }}
          >
            {ext}
          </span>
        </div>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 700,
            color,
          }}
        >
          {pct}%
        </span>
      </div>

      {/* progress bar */}
      <div
        style={{
          height: 7,
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
            background: color,
            boxShadow: `0 0 8px ${color}55`,
            transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

/* ── LanguageBreakdown ───────────────────────────────────── */
export default function LanguageBreakdown({ files }) {
  useChartColors(); /* re-render on theme/palette change */
  const langs = useMemo(() => deriveLanguageSplit(files), [files]);

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <p className="card-header" style={{ marginBottom: 0 }}>
          Language Breakdown
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
          by file count
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {langs.map((l, i) => (
          <LangRow key={l.lang} {...l} delay={i * 70} />
        ))}
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
