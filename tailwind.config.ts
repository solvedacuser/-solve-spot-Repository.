import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 18px 60px rgba(15, 23, 42, 0.14)"
      },
      colors: {
        ink: "#0f172a",
        mist: "#e2e8f0",
        accent: "#0f766e",
        coral: "#d97706"
      }
    }
  },
  plugins: []
};

export default config;

