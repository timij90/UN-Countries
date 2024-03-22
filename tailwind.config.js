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
    themes: ['cmyk','forest','winter', 'nord'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

