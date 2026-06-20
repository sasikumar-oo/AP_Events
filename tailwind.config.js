/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F3E5AB',
          DEFAULT: '#D4AF37', // Primary Gold
          dark: '#B8860B',    // Dark Gold
          premium: '#AA7C11', // Luxury Premium Gold
        },
        luxury: {
          black: '#0B0B0B',     // Absolute Black
          bg: '#111111',        // Dark Background
          card: '#1A1A1A',      // Slightly lighter card background
          border: '#2A2A2A',    // Subtle border color
          muted: '#8E8E8E',     // Muted gray
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.15)',
        'gold-glow-lg': '0 0 25px rgba(212, 175, 55, 0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #F3E5AB 100%)',
        'dark-gradient': 'linear-gradient(180deg, #111111 0%, #0B0B0B 100%)',
      }
    },
  },
  plugins: [],
}
