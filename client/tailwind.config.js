/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070B14',
          900: '#0B1220',
          850: '#111A2E',
          800: '#17233B',
          700: '#1E2E4E',
          600: '#2A3F68',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        violet: {
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Mukta Malar', 'Noto Sans Tamil', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
