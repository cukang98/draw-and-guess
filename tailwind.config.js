/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFB3C6',
          purple: '#C9B1FF',
          blue: '#B3D9FF',
          mint: '#B3FFE0',
          yellow: '#FFE5B3',
          peach: '#FFD4B3',
        },
      },
      fontFamily: {
        fun: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-soft': 'bounce-soft 0.6s ease-in-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
