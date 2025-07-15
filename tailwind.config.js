// tailwind.config.js
module.exports = {
  darkMode: 'class', // Important for toggle to work
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // optional
      },
      width: {
        '90p': '90%',
        '400px': '400px',
        '500px': '500px',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
