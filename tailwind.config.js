/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f8f9fa',
        'surface-container': '#ffffff',
        'surface-bright': '#f1f3f4',
        primary: {
          DEFAULT: '#1a73e8', // Classic Google Blue
          dark: '#174ea6',
          container: '#e8f0fe',
        },
        secondary: {
          DEFAULT: '#188038', // Minimalist Green
          dark: '#0d652d',
          container: '#ceead6',
        },
        accent: {
          DEFAULT: '#d93025', // Minimalist Red
          dark: '#a50e0e',
        },
        zinc: {
           100: '#202124', // Use for main text
           200: '#3c4043',
           300: '#5f6368',
           400: '#80868b',
           500: '#9aa0a6',
           600: '#bdc1c6',
           700: '#dadce0',
           800: '#e8eaed',
           900: '#f1f3f4',
        }
      },
      borderRadius: {
        'xl': '0.5rem',
        '2xl': '0.75rem',
        '3xl': '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'minimal': '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        'minimal-hover': '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
      }
    },
  },
  plugins: [],
}
