/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        coal: '#161616',
        night: '#14102A',
        cream: '#F5EEE4',
        flame: '#F2573B',
        coin: '#E0A526',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', '"Instrument Serif"', 'cursive'],
      },
      keyframes: {
        shakeL: {
          '0%, 100%': { transform: 'rotate(-16deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        shakeR: {
          '0%, 100%': { transform: 'rotate(16deg)' },
          '50%': { transform: 'rotate(-10deg)' },
        },
        bill: {
          '0%': { transform: 'translate(0, 0) rotate(-10deg) scale(0.4)', opacity: '0' },
          '15%': { opacity: '1' },
          '100%': { transform: 'translate(1.5em, -0.45em) rotate(35deg) scale(1)', opacity: '0' },
        },
        recoil: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '30%': { transform: 'translateX(-3%) rotate(-5deg)' },
        },
        blink: {
          '0%, 93%, 100%': { transform: 'scaleY(1)' },
          '96.5%': { transform: 'scaleY(0.06)' },
        },
      },
      animation: {
        shakeL: 'shakeL 0.45s ease-in-out infinite',
        shakeR: 'shakeR 0.45s ease-in-out infinite',
        bill: 'bill 0.7s ease-out infinite',
        recoil: 'recoil 0.23s ease-out infinite',
        blink: 'blink 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
