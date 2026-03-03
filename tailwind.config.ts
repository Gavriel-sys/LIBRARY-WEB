import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
      colors: {
        border: "hsl(214 32% 91%)",
        input: "hsl(214 32% 91%)",
        ring: "hsl(222 84% 5%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222 84% 5%)",
        primary: {
          DEFAULT: "hsl(221 83% 53%)",
          foreground: "hsl(210 40% 98%)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
