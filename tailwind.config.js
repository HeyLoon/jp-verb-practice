/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 優雅的日式顏色系統 - 不使用漸層
        kinari: '#f8f4e6',      // 生成り（米白色）- 主要背景
        shirocha: '#ebe5d9',    // 白茶色 - 次要背景/卡片
        moegi: {
          DEFAULT: '#aacf53',   // 萌黃色 - 強調色
          dark: '#8ba845',
          light: '#c5e084',
        },
        uguisu: {
          DEFAULT: '#6c7a52',   // 鶯色（暗綠）- 文字
          dark: '#4a5238',
          light: '#8d9b73',
        },
        beni: {
          DEFAULT: '#c73e3a',   // 紅色 - 重點按鈕
          dark: '#a32f2c',
          light: '#d96662',
        },
        sumi: {
          DEFAULT: '#2b2b2b',   // 墨色 - 深色文字
          light: '#4a4a4a',
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
