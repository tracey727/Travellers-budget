import type { Config } from "tailwindcss";

/**
 * Wayfarer — deep petrol teal and warm brass, on a warm ivory ground.
 *
 * `brand` is the brass/gold accent scale and `ink` the teal scale that the
 * dark nav, footer and hero sit on. Existing utility classes across the app
 * resolve to this palette without every page needing to be rewritten.
 */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brass / warm gold — the accent on both dark and light grounds.
        brand: {
          50: "#fdf8ec",
          100: "#f8ecc9",
          200: "#f0d795",
          300: "#e6bd5c",
          400: "#dca636",
          500: "#c98f28",
          600: "#a97220",
          700: "#88591c",
          800: "#6d461c",
          900: "#5a3a1a",
          950: "#331f0d",
        },
        // Petrol teal — the ground the dark surfaces sit on.
        ink: {
          50: "#eef4f4",
          100: "#d3e2e1",
          200: "#0e3436",
          300: "#123f42",
          400: "#164a4d",
          500: "#0e3436",
          600: "#0b2a2c",
          700: "#082021",
          800: "#061718",
          900: "#040f10",
          950: "#020a0a",
        },
        brass: {
          DEFAULT: "#c98f28",
          bright: "#e6bd5c",
          deep: "#88591c",
        },
        teal: {
          DEFAULT: "#0e3436",
          deep: "#061718",
          raised: "#123f42",
          high: "#164a4d",
        },
        ivory: {
          DEFAULT: "#faf6ee",
          dim: "#e4dbc7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brassy: "0 0 0 1px rgba(201,143,40,0.25), 0 18px 40px -24px rgba(0,0,0,0.85)",
        card: "0 10px 30px -14px rgba(6,23,24,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
