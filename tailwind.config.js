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
        primary: "#6b8794",
        accent: "#90a8b2",
        "background-light": "#f4f1ea",
        "background-dark": "#1f1b19",
        "surface-dark": "#2b2523",
        "surface-warm": "#fffcf9",
        "warm-beige": "#f2ece1",
        "warm-grey": "#5e5452",
        "warm-muted": "#8c8479",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", "sans-serif"],
        display: ["Pretendard Variable", "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
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
