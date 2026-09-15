/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cairo"', '"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', '"Inter"', 'sans-serif'],
      },
      colors: {
        night: {
          950: '#070B0E',
          900: '#0B1116',
          800: '#101820',
          700: '#182430',
        },
        olive: {
          400: '#8FAE6B',
          500: '#6E8F4E',
          600: '#516B39',
        },
        clay: {
          400: '#E3B872',
          500: '#D0A254',
        },
        signal: {
          500: '#C4432F',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 60px -10px rgba(143, 174, 107, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.05)' },
        },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
