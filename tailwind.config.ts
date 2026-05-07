import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Arc design tokens — deep navy + warm gold journal palette
        bg: {
          0: "#07101F",
          1: "#0B1426",
          2: "#131E33",
          3: "#1B2942",
          4: "#243454",
        },
        ink: {
          0: "#F4ECDB",
          1: "#D9D2C2",
          2: "#9AA3B5",
          3: "#6B7590",
          4: "#495469",
        },
        gold: {
          DEFAULT: "#D4A85A",
          soft: "#B89046",
        },
        branch: {
          a: "#7AA8D6",
          b: "#C98A6B",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.15)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "arc-pulse": "pulse 2s ease-in-out infinite",
        "arc-fade-in": "fadeIn 0.2s ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
