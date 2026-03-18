export default {
  darkMode: "class",
  content: ["./src/**/*.{jsx,js}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        /* score semantic */
        excellent: "var(--score-excellent)",
        good: "var(--score-good)",
        fair: "var(--score-fair)",
        poor: "var(--score-poor)",
        critical: "var(--score-critical)",
        /* neon palette tokens */
        neon: {
          red: "var(--c1)",
          green: "var(--c2)",
          yellow: "var(--c3)",
          cyan: "var(--c4)",
          pink: "var(--c5)",
          violet: "var(--c6)",
        },
        surface: {
          base: "var(--bg-base)",
          card: "var(--bg-card)",
          raise: "var(--bg-raise)",
          input: "var(--bg-input)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn: {
          from: { opacity: 0, transform: "scale(0.94)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        pulseSlow: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.55 } },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        glowPing: {
          "0%": { boxShadow: "0 0 0 0 var(--c4)" },
          "70%": { boxShadow: "0 0 0 10px transparent" },
          "100%": { boxShadow: "0 0 0 0 transparent" },
        },
        countUp: {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          from: { transform: "translateX(-16px)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.45s ease forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        "scale-in": "scaleIn 0.35s ease forwards",
        "pulse-slow": "pulseSlow 2.5s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "glow-ping": "glowPing 2s ease-in-out infinite",
        "count-up": "countUp 0.6s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(0,0,0,0.18)",
        "card-dark": "0 2px 24px 0 rgba(0,0,0,0.55)",
        "neon-red": "0 0 18px 2px rgba(255,76,76,0.45)",
        "neon-green": "0 0 18px 2px rgba(76,175,80,0.45)",
        "neon-yellow": "0 0 18px 2px rgba(255,193,7,0.45)",
        "neon-cyan": "0 0 18px 2px rgba(0,191,255,0.45)",
        "neon-pink": "0 0 18px 2px rgba(255,105,180,0.45)",
        "neon-violet": "0 0 18px 2px rgba(178,102,255,0.45)",
      },
    },
  },
  plugins: [],
};
