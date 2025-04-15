/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5D5CDE',
        'primary-dark': '#4A49B0',
        'light-bg': '#FFFFFF',
        'dark-bg': '#181818',
        'dark-card': '#242424',
        'light-card': '#F5F5F7',
      }
    }
  },
  plugins: [],
}
