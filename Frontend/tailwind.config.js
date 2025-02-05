import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        button: "#3F3F46",
        header: "#27272A"
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    addCommonColors: true,
  })]
}