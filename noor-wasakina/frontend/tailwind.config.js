/** @type {import('tailwindcss').Config} */
const withAlpha = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem' },
      screens: { '2xl': '1240px' },
    },
    extend: {
      colors: {
        emerald: {
          50: '#E9F5F1',
          100: '#CDE8DF',
          200: '#9CCFBF',
          300: '#5FAE96',
          400: '#2F8A70',
          500: '#146B55',
          600: '#0E5544',
          700: '#0C4A3C',
          800: '#0A3D32',
          900: '#062C24',
          950: '#041D18',
        },
        gold: {
          50: '#FDF8E8',
          100: '#FAEFC9',
          200: '#F4E0A0',
          300: '#EDD27C',
          400: '#E5C158',
          500: '#D4AF37',
          600: '#B8922A',
          700: '#8F7020',
          800: '#6A531A',
        },
        cream: {
          50: '#FDFAF3',
          100: '#F8F0DE',
          200: '#EFE3C6',
          300: '#E2D1A8',
        },
        // Semantic colours driven by CSS variables (switch with light/dark mode)
        page: withAlpha('--c-page'),
        surface: withAlpha('--c-surface'),
        ink: withAlpha('--c-ink'),
        muted: withAlpha('--c-muted'),
        line: withAlpha('--c-line'),
        accent: withAlpha('--c-accent'),
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
        ruqaa: ['"Aref Ruqaa"', 'Amiri', 'serif'],
        latin: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(212 175 55 / 0.45), 0 10px 40px -10px rgb(212 175 55 / 0.45)',
        'glow-lg': '0 0 0 1px rgb(229 193 88 / 0.6), 0 20px 60px -15px rgb(212 175 55 / 0.55)',
        soft: '0 20px 50px -25px rgb(0 0 0 / 0.45)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F4E0A0 0%, #E5C158 35%, #D4AF37 65%, #B8922A 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
      },
    },
  },
  plugins: [],
};
