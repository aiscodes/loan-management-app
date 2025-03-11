module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',
        secondary: '#16a34a',
        accent: '#34d399',
        lightAccent: '#a7f3d0',
        lightBg: '#f8f9fa',
        darkBg: '#1a1a1a',
        darkPrimary: '#134e4a',
        darkSecondary: '#2c7a66',
        muted: '#f1f5f9',
        highlight: '#4ade80'
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif']
      },
      boxShadow: {
        'lg-dark': '0 10px 20px rgba(0, 0, 0, 0.15)',
        'btn-dark': '0 4px 8px rgba(0, 0, 0, 0.2)',
        card: '0 6px 15px rgba(0, 0, 0, 0.1)'
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
