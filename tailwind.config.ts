import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          secondary: "#12121a",
          tertiary: "#1a1a2e",
          surface: "#16162a",
        },
        accent: {
          primary: "#8b5cf6",
          secondary: "#6366f1",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          cyan: "#06b6d4",
          orange: "#f97316",
          green: "#22c55e",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
        border: {
          subtle: "#1e293b",
          panel: "#334155",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-violet": "linear-gradient(135deg, #8b5cf6, #6366f1)",
        "gradient-blue": "linear-gradient(135deg, #3b82f6, #6366f1)",
        "gradient-cyan": "linear-gradient(135deg, #06b6d4, #3b82f6)",
        "gradient-orange": "linear-gradient(135deg, #f97316, #ef4444)",
        "gradient-green": "linear-gradient(135deg, #22c55e, #06b6d4)",
      },
      animation: {
        "flash-green": "flashGreen 0.5s ease-out",
        "flash-red": "flashRed 0.5s ease-out",
        "streak-pop": "streakPop 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        flashGreen: {
          "0%": { backgroundColor: "rgba(16,185,129,0.3)" },
          "100%": { backgroundColor: "transparent" },
        },
        flashRed: {
          "0%": { backgroundColor: "rgba(239,68,68,0.3)" },
          "100%": { backgroundColor: "transparent" },
        },
        streakPop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}

export default config
