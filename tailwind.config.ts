import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        aegoryn: {
          black: "#090909",
          charcoal: "#161616",
          gold: "#D4AF37",
          parchment: "#F6F1E7"
        }
      }
    }
  },
  plugins: []
};

export default config;
