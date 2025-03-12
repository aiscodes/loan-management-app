module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f1f1f', // Dark gray primary color
        secondary: '#343434', // Darker gray secondary color
        accent: '#2a2a2a', // Slightly lighter dark gray accent
        lightAccent: '#585858', // A light gray accent
        lightBg: '#1a1a1a', // Dark background
        darkBg: '#0a0a0a', // Very dark background
        darkPrimary: '#0d0d0d', // Almost black primary color
        darkSecondary: '#202020', // Dark secondary color
        muted: '#2e2e2e', // Muted dark gray
        highlight: '#4c4c4c' // Highlight in dark gray
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif']
      },
      boxShadow: {
        'lg-dark': '0 10px 20px rgba(0, 0, 0, 0.3)', // Darker shadow
        'btn-dark': '0 4px 8px rgba(0, 0, 0, 0.3)', // Darker button shadow
        card: '0 6px 15px rgba(0, 0, 0, 0.15)' // Dark card shadow
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
