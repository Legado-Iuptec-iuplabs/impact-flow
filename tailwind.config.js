/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0A0F14',
        'surface': '#121820',
        'border': '#1E293B',
        'laranja': '#FDB913',
        'ciano': '#2DD4BF',
        'text-main': '#F1F5F9',
        'text-dim': '#94A3B8'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}