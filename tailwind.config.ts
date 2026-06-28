import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        card: "#1a1a1a",
        gold: {
          DEFAULT: "#c9a96e",
          light: "#e2c898",
          dark: "#a8834a",
        },
        muted: "#888888",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        "ultra-wide": "0.4em",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #c9a96e 0%, #e2c898 50%, #c9a96e 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
