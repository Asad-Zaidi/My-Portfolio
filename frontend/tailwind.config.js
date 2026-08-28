/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
    },
    extend: {
      colors: {
        navy: {
          950: "#03050b",
          900: "#070c18",
          850: "#0a1120",
          800: "#0e1729",
          700: "#152037",
          600: "#1c2a47",
        },
        accent: {
          light: "#3b82f6",
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: ["'Google Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(15, 23, 42, 0.08)",
        "card-hover": "0 16px 40px -12px rgba(37, 99, 235, 0.25)",
        glow: "0 0 60px 10px rgba(59, 130, 246, 0.25)",
      },
    },
  },
  plugins: [],
};
