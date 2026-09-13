import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4f1ea",
        ink: "#1a1a1a",
        alive: "#2aa79b",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
