import { useState, useEffect } from "react";
import { getPaletteColors } from "../utils/path";

/**
 * useChartColors()
 *
 * Returns resolved color values (actual hex/rgb strings) read from CSS
 * custom properties. Re-resolves whenever:
 *   - the `dark` class is toggled on <html>
 *   - the `data-palette` attribute changes on <html>
 *
 * Usage:
 *   const colors = useChartColors();
 *   <Bar fill={colors.c1} />
 */
export function useChartColors() {
  const [colors, setColors] = useState(() => {
    // Resolve immediately if DOM is available, otherwise fall back
    if (typeof window !== "undefined") return getPaletteColors();
    return {
      c1: "#FF4C4C",
      c2: "#4CAF50",
      c3: "#FFC107",
      c4: "#00BFFF",
      c5: "#FF69B4",
      c6: "#B266FF",
      grid: "rgba(255,255,255,0.05)",
      text: "#888888",
      tooltipBg: "#1E1E2F",
      tooltipBorder: "rgba(255,255,255,0.10)",
      glowC1: "rgba(255,76,76,0.35)",
      glowC2: "rgba(76,175,80,0.35)",
      glowC3: "rgba(255,193,7,0.35)",
      glowC4: "rgba(0,191,255,0.35)",
      glowC5: "rgba(255,105,180,0.35)",
      glowC6: "rgba(178,102,255,0.35)",
      accent: "#00BFFF",
      scoreExcellent: "#4CAF50",
      scoreGood: "#8BC34A",
      scoreFair: "#FFC107",
      scorePoor: "#FF4C4C",
      scoreCritical: "#FF1744",
    };
  });

  useEffect(() => {
    const root = document.documentElement;

    const refresh = () => {
      // Small rAF delay so CSS vars settle after class/attr changes
      requestAnimationFrame(() => setColors(getPaletteColors()));
    };

    // Watch class list changes (dark/light toggle)
    const classObs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.attributeName === "class" || m.attributeName === "data-palette") {
          refresh();
        }
      }
    });
    classObs.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-palette"],
    });

    // Also re-resolve on system color scheme change
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", refresh);

    // Initial resolve after mount
    refresh();

    return () => {
      classObs.disconnect();
      mql.removeEventListener("change", refresh);
    };
  }, []);

  return colors;
}
