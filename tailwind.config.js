/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#1e293b',
          100: '#334155',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },

        // 🌙 MAIN DARK THEME COLORS
        background: '#0f172a',   // main bg
        surface: '#1e293b',      // cards
        text: '#e2e8f0',         // main text
        muted: '#94a3b8',        // secondary text
        border: '#334155',
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      boxShadow: {
        soft: '0 4px 10px rgba(0, 0, 0, 0.4)', // darker shadow
      }
    },
  },
  plugins: [],
}