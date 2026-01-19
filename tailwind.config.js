/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 日式顏色系統
        washi: {
          cream: '#e6eed6',
          light: '#dde2c6',
        },
        matcha: {
          DEFAULT: '#bbc5aa',
          light: '#c9d1b8',
          dark: '#a8b298',
        },
        vermillion: {
          DEFAULT: '#a72608',
          light: '#c93010',
          dark: '#8a1f06',
        },
        sumi: {
          DEFAULT: '#090c02',
          light: '#1a1d12',
          lighter: '#2a2d22',
        },
        // 保留原有的 primary 作為備用
        primary: {
          50: '#f0e6ed',
          100: '#e6eed6',
          200: '#dde2c6',
          300: '#bbc5aa',
          400: '#a8b298',
          500: '#a72608',
          600: '#8a1f06',
          700: '#6d1805',
          800: '#501204',
          900: '#330c02',
        },
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
