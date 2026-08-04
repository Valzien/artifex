/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          foreground: "hsl(var(--color-primary-foreground))",
        },
        secondary: { DEFAULT: "hsl(var(--color-secondary))" },
        accent: { DEFAULT: "hsl(var(--color-accent))" },
        background: "hsl(var(--color-background))",
        surface: "hsl(var(--color-surface))",
        border: "hsl(var(--color-border))",
        ink: "hsl(var(--color-ink))",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
      borderRadius: { DEFAULT: "0.75rem", lg: "1rem", xl: "1.25rem" },
      boxShadow: {
        soft: "0 2px 12px -2px rgb(43 38 32 / 0.08)",
        card: "0 4px 20px -4px rgb(43 38 32 / 0.10)",
      },
    },
  },
  plugins: [],
};
