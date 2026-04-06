import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#272119",
        muted: "#302820",
        border: "#4a3d32",
        accent: "#c57a3d",
        accent2: "#f2aa63",
        ink: "#f5efe8",
        soft: "#c6b6a8"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(197, 122, 61, 0.28), 0 18px 40px rgba(108, 63, 30, 0.32)"
      },
      backgroundImage: {
        radial:
          "radial-gradient(circle at 12% 15%, rgba(197,122,61,.16), transparent 42%), radial-gradient(circle at 88% 0%, rgba(242,170,99,.09), transparent 36%)"
      }
    }
  },
  plugins: []
};

export default config;
