module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f1f1f',
        secondary: '#343434',
        accent: '#2a2a2a',
        lightAccent: '#585858',
        lightBg: '#1a1a1a',
        darkBg: '#0a0a0a',
        darkPrimary: '#0d0d0d',
        darkSecondary: '#202020',
        muted: '#2e2e2e',
        highlight: '#4c4c4c'
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif']
      },
      boxShadow: {
        'lg-dark': '0 10px 20px rgba(0, 0, 0, 0.3)',
        'btn-dark': '0 4px 8px rgba(0, 0, 0, 0.3)',
        card: '0 6px 15px rgba(0, 0, 0, 0.15)'
      },
      spacing: {
        128: '32rem'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-up': 'scale-up 0.3s ease-in-out'
      },
      screens: {
        xs: '480px'
      }
    }
  },
  plugins: []
}
