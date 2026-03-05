module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      }
    },
  },
  safelist: [
    {
      pattern: /data-\[controller=visible\]/,
    },
  ],
  darkMode: 'class',
  plugins: [],
}
