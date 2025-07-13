/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', //  Enable dark mode via class
  theme: {
    extend: {},
  },
  plugins: [
    scrollbarHide, // Import and use scrollbar-hide plugin
  ],
}
