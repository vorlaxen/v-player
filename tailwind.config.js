module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
