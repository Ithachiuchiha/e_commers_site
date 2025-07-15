/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '480px', // Added extra small breakpoint
      },
      colors: {
        gold: '#E6A817',
        'gold-light': '#F5CB6A',
        'gold-dark': '#B78412',
        green: '#1C6E43',
        'green-light': '#4D936E',
        'green-dark': '#0F4E2C',
        cream: '#FFF8E7',
        'cream-dark': '#F5EDD6',
        gray: {
          900: '#2D2D2D',
          800: '#3D3D3D',
          700: '#5D5D5D',
          600: '#7D7D7D',
          500: '#9D9D9D',
          400: '#ADADAD',
          300: '#D1D1D1',
          200: '#E1E1E1',
          100: '#F1F1F1',
          50: '#F8F8F8',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.07)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '1/4': '25%',
        '1/3': '33.333333%',
        '1/2': '50%',
        '2/3': '66.666667%',
        '3/4': '75%',
      },
    },
  },
  plugins: [],
};