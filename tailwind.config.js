/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "maple-regular": ["Maple Mono"],
    },
    extend: {
      colors: {
        base: "#191724", // Primary background
        surface: "#1f1d2e", // Secondary background
        overlay: "#26233a", // Tertiary background
        muted: "#6e6a86", // Low contrast foreground
        subtle: "#908caa", // Medium contrast foreground
        text: "#e0def4", // High contrast foreground
        love: "#eb6f92", // Errors, deletions
        gold: "#f6c177", // Warnings, strings
        rose: "#ebbcba", // Modified files
        pine: "#3178c6", // Renamed files, keywords
        foam: "#9ccfd8", // Information, additions
        iris: "#c4a7e7", // Hints, links
        highlightLow: "#21202e", // Cursor line background
        highlightMed: "#403d52", // Selection background
        highlightHigh: "#524f67", // Borders, cursor background
      },
    },
  },
  plugins: [],
};
