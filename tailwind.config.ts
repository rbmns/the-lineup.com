
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // The Lineup Coastal Minerals Palette
        'pure-white': '#FFFFFF',
        'graphite-grey': '#2C3E50', 
        'mist-grey': '#ECEFF1',
        'ocean-teal': '#00A389',
        'sunrise-ochre': '#E6AA68',
        'carbon-black': '#000000',
        
        primary: {
          DEFAULT: "#00A389", // ocean-teal
          foreground: "#FFFFFF", // pure-white
        },
        secondary: {
          DEFAULT: "#2C3E50", // graphite-grey
          foreground: "#FFFFFF", // pure-white
        },
        muted: {
          DEFAULT: "#ECEFF1", // mist-grey
          foreground: "#2C3E50", // graphite-grey
        },
        accent: {
          DEFAULT: "#E6AA68", // sunrise-ochre
          foreground: "#2C3E50", // graphite-grey
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF", // pure-white
          foreground: "#2C3E50", // graphite-grey
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'display': ['Montserrat', 'sans-serif'], // alias for montserrat
        'body': ['Lato', 'sans-serif'], // alias for lato
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1', letterSpacing: '-0.025em', fontWeight: '800' }], // 64px
        'h1': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }], // 48px
        'h2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '700' }], // 36px  
        'h3': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }], // 30px
        'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }], // 24px
        'body-base': ['1.125rem', { lineHeight: '1.7' }], // 18px with relaxed leading
        'small': ['0.875rem', { lineHeight: '1.5' }], // 14px
      },
      borderRadius: {
        lg: "0.5rem", // 8px - for prominent cards, modals
        md: "0.375rem", // 6px - for most buttons, general cards, inputs
        sm: "0.25rem", // 4px - for very subtle rounding
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(44, 62, 80, 0.05)',
        'md': '0 4px 6px -1px rgba(44, 62, 80, 0.1), 0 2px 4px -1px rgba(44, 62, 80, 0.06)',
        'lg': '0 10px 15px -3px rgba(44, 62, 80, 0.1), 0 4px 6px -2px rgba(44, 62, 80, 0.05)',
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(4px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      scale: {
        '101': '1.01',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
