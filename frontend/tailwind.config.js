/** @type {import('tailwindcss').Config} */

// Importa el plugin al inicio del archivo
import forms from '@tailwindcss/forms'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        home: "url('/bg.svg')",
      },
      backgroundSize: {
        "home-xl": "50%",
      },
    },
  },
  plugins: [forms],
};
