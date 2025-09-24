/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'rojo-Redes': 'rgb(229,65,56)',
        'rojo-Logo': 'rgb(236, 15, 0)',
        'verde-titulo':'rgb(0, 189, 127)',
      }
    },
  },
  plugins: [PrimeUI],
}

