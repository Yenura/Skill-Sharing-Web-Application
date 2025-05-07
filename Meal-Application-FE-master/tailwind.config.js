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
        PrimaryColor: "#f3f1e7",     // Pale Linen – a clean, neutral background
        SecondaryColor: "#ffb64d", // Burnt Orange – inviting and friendly accents
        DarkColor: "#ff6a13",        // Tangerine Orange – bold and energetic
        ExtraDarkColor: "#c84b12",    // Dark Copper – for for emphasis and text
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
