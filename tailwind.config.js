/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./scripts/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brandFlame: '#FF4E00',
        brandFlameLight: '#FF6B2B',
        darkBg: '#0A0A0B',
        darkSurface: '#141416',
        darkCard: '#16161A',
        darkPressed: '#1B1B20',
        textPrimary: '#F5F2ED',
        textMuted: 'rgba(245, 242, 237, 0.65)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: [],
}
