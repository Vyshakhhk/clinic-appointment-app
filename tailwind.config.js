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
  safelist: [
    // Today's highlight classes
    'bg-purple-100',
    'border-2',
    'border-purple-500',
    'text-purple-700',
    'rounded-lg',
    'font-semibold',
    // Selected day classes
    'bg-purple-600',
    'text-white',
  ],
};
