import animate from 'tailwindcss-animate'

const config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)'],
      },
    },
  },
  plugins: [animate],
}

export default config
