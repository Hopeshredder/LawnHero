/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightest: "var(--color-lightest)",
        light: "var(--color-light)",
        medium: "var(--color-medium)",
        dark: "var(--color-dark)",
        darkest: "var(--color-darkest)",
      },
    },
  },
  plugins: [],
};
