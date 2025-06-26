
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
        background: "rgb(248 245 240)", // Sand
        foreground: "rgb(60 64 67)", // Charcoal
        
        // Coastal color palette
        'sand': 'rgb(248 245 240)',
        'coconut': 'rgb(252 250 247)', 
        'ivory': 'rgb(250 248 245)',
        'sage': 'rgb(218 224 220)',
        'clay': 'rgb(201 181 162)',
        'seafoam': 'rgb(162 180 178)',
        'overcast': 'rgb(128 130 133)',
        'charcoal': 'rgb(60 64 67)',
        
        primary: {
          DEFAULT: "rgb(201 181 162)", // Clay
          foreground: "rgb(60 64 67)",
        },
        secondary: {
          DEFAULT: "rgb(218 224 220)", // Sage
          foreground: "rgb(60 64 67)",
        },
        muted: {
          DEFAULT: "rgb(128 130 133)", // Overcast
          foreground: "rgb(60 64 67)",
        },
        accent: {
          DEFAULT: "rgb(162 180 178)", // Seafoam
          foreground: "rgb(60 64 67)",
        },
        destructive: {
          DEFAULT: "rgb(205 92 92)",
          foreground: "rgb(252 250 247)",
        },
        card: {
          DEFAULT: "rgb(252 250 247)", // Coconut
          foreground: "rgb(60 64 67)",
        },
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        lg: "0.125rem", // Minimal radius
        md: "0.125rem",
        sm: "0.125rem",
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
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
