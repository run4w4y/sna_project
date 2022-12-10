const defaultColors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      ...defaultColors,
    },
    extend: {},
  },
  variants: {},
  plugins: [],
}
