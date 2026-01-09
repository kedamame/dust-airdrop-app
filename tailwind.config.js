/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'trash-green': '#4ADE80',
        'trash-brown': '#8B4513',
        'toxic-purple': '#9333EA',
        'slime-green': '#84CC16',
        'rot-orange': '#F97316',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'stink': 'stink 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        stink: {
          '0%, 100%': { opacity: '0.5', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '1', transform: 'translateY(-10px) scale(1.1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
};







