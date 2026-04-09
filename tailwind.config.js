/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        surface: '#121214',
        'surface-container': '#1e1e21',
        'surface-bright': '#2a2a2d',
        primary: {
          DEFAULT: '#a3b3ff', // Material 3 inspired Blue/Indigo
          dark: '#3f51b5',
          container: '#1a237e',
        },
        secondary: {
          DEFAULT: '#c2efd0', // Soft Green
          dark: '#4caf50',
          container: '#1b5e20',
        },
        accent: {
          DEFAULT: '#ffb4ab', // M3 Soft Red/Coral
          dark: '#ba1a1a',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(163, 179, 255, 0.15)',
        'glow-secondary': '0 0 20px rgba(194, 239, 208, 0.15)',
      }
    },
  },
  plugins: [],
}
