/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#243b6b",
        accent: "#4f6ea8",
        "background-light": "#f4f1ea",
        "background-dark": "#1f1b19",
        "surface-dark": "#2b2523",
        "surface-warm": "#fffcf9",
        "warm-beige": "#f2ece1",
        "warm-grey": "#5e5452",
        "warm-muted": "#8c8479",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
