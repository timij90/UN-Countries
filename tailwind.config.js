/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`],
  theme: {
    container: {
      center: true,
    },
    
    extend: {},
  },
  daisyui: {
    themes: ['nord'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

