/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      transitionDuration: {
        '1500': '1500ms',
        '1800': '1800ms',
      },
      transitionDelay: {
        '300': '300ms',
        '600': '600ms',
        '1200': '1200ms',
      },
      colors: {
        PrimaryColor: "#fff7f0",     // Light peach background – soft and appetizing
        SecondaryColor: "#ffc285", // Mellow orange – for highlights and accents
        DarkColor: "#ff8c42",        // Bold orange – strong and vibrant primary color
        ExtraDarkColor: "#cc5803",    // Deep burnt orange – for headers, buttons, or emphasis
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
