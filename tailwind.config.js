/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,vue,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FDA214', // Vibrant Orange - RGB: 253, 162, 20 | HSL: 37°, 98%, 54%
        secondary: '#BCCED9', // Soft Blue - RGB: 188, 206, 217 | HSL: 203°, 28%, 79%
        accent: '#304859', // Dark Blue - RGB: 48, 72, 89 | HSL: 205°, 30%, 27%
        'deep-navy': '#152938', // Deep Navy - RGB: 21, 41, 56 | HSL: 206°, 45%, 15%
        'light-gray': '#F2F2F2', // Light Gray - RGB: 242, 242, 242 | HSL: 0°, 0%, 95%
        muted: '#7191A5', // Muted Blue - RGB: 113, 145, 165 | HSL: 203°, 22%, 55%
        info: '#6395B8', // Sky Blue - RGB: 99, 149, 184 | HSL: 205°, 37%, 55%
        'white-smoke': '#FCFCFC', // White Smoke - RGB: 252, 252, 252 | HSL: 0°, 0%, 99%
      },
      fontFamily: {
        sans: ['Atkinson Hyperlegible', 'sans-serif'],
      },
      fontSize: {
        h1: ['48px', { fontWeight: 'bold' }],
        h2: ['32px', { fontWeight: 'bold' }],
        h3: ['20px', { fontWeight: 'bold' }],
        body: ['18px', { fontWeight: 'bold' }],
        gameNumber4x4: ['56px', { fontWeight: 'bold' }],
        gameNumber6x6: ['44px', { fontWeight: 'bold' }],
      },
    },
  },
  plugins: [],
};
