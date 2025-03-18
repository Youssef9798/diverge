import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('light', `.light &`)
    }),
  ],
}
