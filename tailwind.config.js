/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html,css}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Paperlogy', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#0D1424',
          'navy-dark': '#0A0E1A',
          blue: '#1E88E5',
          mint: '#00D284',
          'mint-hover': '#00B873',
          'mint-light': '#E6F9F3',
          gray: '#F4F7F6',
          text: '#111827',
          muted: '#4B5563',
          border: '#EEF2F6',
        }
      }
    },
  },
  plugins: [],
};
