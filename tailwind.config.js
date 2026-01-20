/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 新配色主題（Japanese Palette）
        'jp-text': '#4061A0',       // 主要文字顏色（藍灰色）
        'jp-bg': '#f8f9fb',         // 應用程式背景（淡白色）
        'jp-primary': '#EEB8C4',    // 主要按鈕/互動元素（櫻花粉）
        'jp-secondary': '#D0574E',  // 錯誤狀態/「答錯」回饋（柔和紅）
        'jp-accent': '#E6D47B',     // 強調色（柔和金）
        'jp-success': '#8BA888',    // 成功狀態/「正確」回饋（抹茶綠）
        
        // === 以下為舊配色（保留以便漸進式遷移）===
        // Classic Japanese Indigo & Washi Paper Color Scheme
        
        // Background (Washi Paper)
        washi: {
          DEFAULT: '#FDFBF7',    // Main app background - pure washi paper
          dark: '#F3EFE6',       // Card backgrounds, contrast areas
        },
        
        // Primary Accent (Aizome Indigo)
        aizome: {
          DEFAULT: '#1E3F66',    // Primary buttons, active tabs, main titles
          light: '#2A5280',      // Hover states on buttons
          dark: '#152D4A',       // Darker variant for pressed states
        },
        
        // Text & Borders (Sumi Ink)
        sumi: {
          DEFAULT: '#333333',    // Main body text
          light: '#666666',      // Secondary text, labels, subtle borders
          lighter: '#999999',    // Tertiary text, disabled states
        },
        
        // Feedback States
        matcha: {
          DEFAULT: '#6A845F',    // Correct/Success states
          light: '#8BA177',      // Light variant for backgrounds
          dark: '#556B4C',       // Dark variant for emphasis
        },
        akane: {
          DEFAULT: '#C55A5A',    // Incorrect/Error states
          light: '#D97B7B',      // Light variant for backgrounds
          dark: '#A04747',       // Dark variant for emphasis
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
