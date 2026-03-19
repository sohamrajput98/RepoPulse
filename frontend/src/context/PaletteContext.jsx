import { createContext, useContext, useState, useEffect } from "react";

/**
 * Palettes available per mode.
 * Keys used as data-palette attribute value on <html>.
 * 'default' means no attribute set (uses base CSS vars).
 */
export const DARK_PALETTES = [
  { id: "default", label: "Neon", swatch: ["#FF4C4C", "#00BFFF", "#FFC107"] },
  {
    id: "synthwave",
    label: "Synthwave",
    swatch: ["#FF2D55", "#0AFFD4", "#7A5FFF"],
  },
  { id: "matrix", label: "Matrix", swatch: ["#39FF14", "#FFFF00", "#FF3B30"] },
];

export const LIGHT_PALETTES = [
  {
    id: "default",
    label: "Default",
    swatch: ["#039BE5", "#43A047", "#FB8C00"],
  },
  { id: "warm", label: "Warm", swatch: ["#1565C0", "#2E7D32", "#E65100"] },
];

const STORAGE_KEY = "repopulse_palette";

const PaletteContext = createContext(null);

export function PaletteProvider({ children }) {
  const [palette, setPaletteState] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? "default",
  );

  const setPalette = (id) => {
    setPaletteState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (palette === "default") {
      root.removeAttribute("data-palette");
    } else {
      root.setAttribute("data-palette", palette);
    }
  }, [palette]);

  return (
    <PaletteContext.Provider
      value={{ palette, setPalette, DARK_PALETTES, LIGHT_PALETTES }}
    >
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used inside <PaletteProvider>");
  return ctx;
}
