import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#ED1C24",
          redDark: "#C81018",
          redLight: "#FF4D55",
          black: "#0A0A0A",
          dark: "#121212",
          surface: "#181818",
          surfaceHover: "#222222",
          border: "#282828",
          muted: "#8E8E93",
          lightMuted: "#A1A1AA",
        },
        verdict: {
          true: "#10B981",
          false: "#ED1C24",
          misleading: "#F59E0B",
          partlyTrue: "#EAB308",
          unverified: "#6B7280",
        },
      },
      fontFamily: {
        headline: ["var(--font-space-grotesk)", "var(--font-anek-malayalam)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "var(--font-anek-malayalam)", "sans-serif"],
        sans: ["var(--font-inter)", "var(--font-anek-malayalam)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        malayalam: ["var(--font-anek-malayalam)", "var(--font-inter)", "sans-serif"],
        anek: ["var(--font-anek-malayalam)", "var(--font-inter)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-up": "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "shake": "shake 0.35s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-4px)" },
          "40%, 80%": { transform: "translateX(4px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
