/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#124179",
        "navy-light": "#1a5499",
        "navy-dark": "#0d2f5a",
      },
      fontFamily: {
        milonga: ["Milonga", "serif"],
        prata: ["Prata", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};