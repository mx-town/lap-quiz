import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
          tertiary: "var(--color-bg-tertiary)",
          surface: "var(--color-bg-surface)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          panel: "var(--color-border-panel)",
        },
        accent: {
          primary: "var(--color-accent-primary)",
          secondary: "var(--color-accent-secondary)",
          success: "#16a34a",
          warning: "#d97706",
          danger: "#dc2626",
          cyan: "#0891b2",
          orange: "#ea580c",
          green: "#16a34a",
          blue: "#2563eb",
          amber: "#d97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "8px",
        "2xl": "8px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.04)",
        md: "0 2px 8px rgba(0, 0, 0, 0.08)",
        lg: "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        shake: "shake 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-3px)" },
          "75%": { transform: "translateX(3px)" },
        },
      },
    },
  },
  plugins: [],
}

export default config
