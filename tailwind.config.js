/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a24',
          600: '#24242f',
          500: '#2e2e3a',
        },
        accent: {
          primary: '#00ffc8',
          secondary: '#00d4aa',
          glow: 'rgba(0, 255, 200, 0.3)',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 255, 200, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 255, 200, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 200, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 255, 200, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
