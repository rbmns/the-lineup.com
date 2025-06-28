
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
        background: "rgb(248 245 240)", // Sand - main site background
        foreground: "rgb(30 30 30)", // Midnight text
        
        // Coastal color palette - refined and softened
        'sand': 'rgb(248 245 240)', // Main site background
        'coconut': 'rgb(252 250 247)', // Cards and navigation
        'ivory': 'rgb(250 248 245)', 
        'sage': 'rgb(218 224 220)', // Soft borders and accents
        'clay': 'rgb(238 108 77)', // Secondary buttons and accents
        'sunset-yellow': 'rgb(255 158 0)', // Highlights and hovers
        'vibrant-aqua': 'rgb(144 224 239)', // Primary buttons
        'ocean-deep': 'rgb(0 95 115)', // Text and borders
        'overcast': 'rgb(106 122 131)', // Muted text
        'charcoal': 'rgb(30 30 30)',
        'midnight': 'rgb(30 30 30)',
        
        primary: {
          DEFAULT: "rgb(144 224 239)", // Vibrant aqua for primary buttons
          foreground: "rgb(30 30 30)",
        },
        secondary: {
          DEFAULT: "rgb(238 108 77)", // Clay for secondary elements
          foreground: "rgb(30 30 30)",
        },
        muted: {
          DEFAULT: "rgb(218 224 220)", // Sage for muted elements
          foreground: "rgb(30 30 30)",
        },
        accent: {
          DEFAULT: "rgb(255 158 0)", // Sunset yellow for accents
          foreground: "rgb(30 30 30)",
        },
        destructive: {
          DEFAULT: "rgb(238 108 77)", // Use clay instead of harsh red
          foreground: "rgb(252 250 247)",
        },
        card: {
          DEFAULT: "rgb(252 250 247)", // Coconut for cards
          foreground: "rgb(30 30 30)",
        },
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        lg: "0.5rem", // Softer, more rounded
        md: "0.375rem", // Standard rounded corners
        sm: "0.25rem",
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
        "gentle-bounce": {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-2px)"
          }
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "gentle-bounce": "gentle-bounce 0.5s ease-in-out",
      },
      boxShadow: {
        'coastal': '0 2px 8px 0 rgba(0, 95, 115, 0.08)',
        'coastal-hover': '0 4px 16px 0 rgba(0, 95, 115, 0.12)',
        'navigation': '0 1px 6px 0 rgba(0, 95, 115, 0.06)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
