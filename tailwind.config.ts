import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#182230",
        header: "#101828",
        highlight: "#475467",
        placeholder: "#667085",
        buttonText: "#344054",
        foundationYellowY300: "#f68b36", // Directly using hex values
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        fixelDisplay: ["var(--font-roboto-mono)"],
        corbel: ["var(--font-corbel)"],
        lora: ["var(--font-lora)"],
      },
      animation: {
        "spin-slow": "spin 2s linear infinite", // Slows down the spin animation
      },
    },
  },
  plugins: [],
};

export default config;
