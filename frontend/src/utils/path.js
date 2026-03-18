export function basename(p) {
  return p?.split(/[\\/]/).pop() ?? p;
}

/* ── Score → CSS variable name ─────────────────────────── */
export function scoreColorVar(score) {
  if (score >= 85) return "var(--score-excellent)";
  if (score >= 70) return "var(--score-good)";
  if (score >= 50) return "var(--score-fair)";
  if (score >= 30) return "var(--score-poor)";
  return "var(--score-critical)";
}

/**
 * Legacy alias — components that pass the value directly to inline style
 * still call scoreColor(); we keep the name but now return a CSS var.
 */
export const scoreColor = scoreColorVar;

/* ── Score → badge class ────────────────────────────────── */
export function scoreBadgeClass(score) {
  if (score >= 85) return "badge badge-excellent";
  if (score >= 70) return "badge badge-good";
  if (score >= 50) return "badge badge-fair";
  if (score >= 30) return "badge badge-poor";
  return "badge badge-critical";
}

/* ── Score label ────────────────────────────────────────── */
export function scoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Poor";
  return "Critical";
}

/**
 * getPaletteColors()
 * Reads the current CSS variables from the document root and returns
 * resolved hex/rgb strings for use in canvas-based charts (Recharts, Chart.js)
 * that cannot consume CSS variables directly.
 *
 * Call inside a useEffect or after mount so the DOM is ready.
 */
export function getPaletteColors() {
  const style = getComputedStyle(document.documentElement);
  const get = (v) => style.getPropertyValue(v).trim();
  return {
    c1: get("--c1"),
    c2: get("--c2"),
    c3: get("--c3"),
    c4: get("--c4"),
    c5: get("--c5"),
    c6: get("--c6"),
    grid: get("--chart-grid"),
    text: get("--chart-text"),
    tooltipBg: get("--tooltip-bg"),
    tooltipBorder: get("--tooltip-border"),
    glowC1: get("--glow-c1"),
    glowC2: get("--glow-c2"),
    glowC3: get("--glow-c3"),
    glowC4: get("--glow-c4"),
    glowC5: get("--glow-c5"),
    glowC6: get("--glow-c6"),
    accent: get("--accent"),
    scoreExcellent: get("--score-excellent"),
    scoreGood: get("--score-good"),
    scoreFair: get("--score-fair"),
    scorePoor: get("--score-poor"),
    scoreCritical: get("--score-critical"),
  };
}
