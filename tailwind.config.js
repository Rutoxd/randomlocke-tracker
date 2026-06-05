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
        pokedex: {
          red:     '#CC0000',
          darkred: '#8B0000',
          blue:    '#1a6bcc',
          green:   '#2d8a4e',
          gold:    '#c9a900',
          silver:  '#8a9bb5',
          black:   '#1a1a2e',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        poke:  ['"Nunito"', 'sans-serif'],
      },
      animation: {
        'led-pulse': 'pulse 1.5s ease-in-out infinite',
        'slide-in':  'slideIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        slideIn:  { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        bounceIn: { from: { opacity: 0, transform: 'scale(0.8)' },       to: { opacity: 1, transform: 'scale(1)' } },
      },
      boxShadow: {
        'pokedex': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'screen':  'inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)',
        'led':     '0 0 8px currentColor',
      }
    },
  },
  plugins: [],
}