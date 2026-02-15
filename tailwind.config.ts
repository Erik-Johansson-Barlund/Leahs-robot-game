import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        body: ["'Nunito'", "sans-serif"]
      },
      animation: {
        bob: "bob 1.2s ease-in-out infinite",
        pop: "pop 220ms ease-out"
      },
      keyframes: {
        bob: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" }
        },
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
