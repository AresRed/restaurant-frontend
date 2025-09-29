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
        'rojo-Redes-Hover':'rgb(194, 28, 32)',
        'fondo-oscuro':'rgb(23, 23, 23)',
        'rojo-principal':'rgb(204, 54, 54)',
        'rojo-fondo-claro':'rgb(254, 242, 242)'
      }
    },
  },
  plugins: [PrimeUI],
}

