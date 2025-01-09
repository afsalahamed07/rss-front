/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "maple-regular": ["Maple Mono"],
    },
    extend: {
      colors: {
        background: "#000000", // True black
        surface: "#1a1a1a", // Secondary background
        overlay: "#262626", // Tertiary background
        primary: "#ffffff", // Primary text
        muted: "#8c8c8c", // Muted secondary text
        heading: "#d4a5a5", // Headings and prominent text
        accent: "#68a5f1", // Accent for buttons
        hover: "#4c82d1", // Hover state for buttons
        border: "#333333", // Borders and dividers
        link: "#c9a4f7", // Links
        success: "#4caf50", // Success messages
        error: "#f44336", // Error messages
      },
    },
  },
  plugins: [],
};
