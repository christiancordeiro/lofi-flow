/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {     
      fontFamily: {
        mastone: ['Mastone', 'sans-serif'], // Nome da fonte personalizada
      },
    },
  },
  plugins: [],
}