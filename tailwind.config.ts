import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        anora: {
          black: "#000000",
          ink: "#0a0a0a",
          card: "#111111",
          line: "#262626",
          mute: "#9a9a9a",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Montserrat", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.45em",
      },
    },
  },
  plugins: [],
};

export default config;
