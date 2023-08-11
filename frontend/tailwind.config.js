/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          pong: {
            100: '#6E6FA5',
            200: '#38396F',
            300: '#2A2957',
            400: '#24244F',
            500: '#161748',
            600: '#161748',
            700: '#161748',
            800: '#161748',
            900: '#161748'
          }
        }
      }
    }
  },
  plugins: []
};
