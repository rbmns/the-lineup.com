
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
        background: "rgb(248 245 240)", // Sand - main background
        foreground: "rgb(0 95 115)", // Ocean deep text
        
        // Coastal color palette - vibrant and natural
        'sand': 'rgb(248 245 240)',      // Main site background
        'coconut': 'rgb(252 250 247)',   // Event cards & nav background
        'ivory': 'rgb(250 248 245)',     // Alternative sections
        'sage': 'rgb(218 224 220)',      // Muted accents (legacy)
        'clay': 'rgb(201 181 162)',      // Supportive color for tags/secondary
        'seafoam': 'rgb(162 180 178)',   // Supportive green (legacy)
        'ocean-deep': 'rgb(0 95 115)',   // Primary brand color
        'vibrant-aqua': 'rgb(144 224 239)', // Accent color for hovers/highlights
        'driftwood': 'rgb(140 140 137)', // Neutral gray (legacy)
        'midnight': 'rgb(30 30 30)',     // Dark text (legacy)
        
        primary: {
          DEFAULT: "rgb(0 95 115)", // Ocean Deep
          foreground: "rgb(252 250 247)", // Coconut text on ocean
        },
        secondary: {
          DEFAULT: "rgb(201 181 162)", // Clay
          foreground: "rgb(0 95 115)", // Ocean Deep
        },
        muted: {
          DEFAULT: "rgb(140 140 137)", // Driftwood
          foreground: "rgb(0 95 115)", // Ocean Deep
        },
        accent: {
          DEFAULT: "rgb(144 224 239)", // Vibrant Aqua
          foreground: "rgb(0 95 115)", // Ocean Deep
        },
        destructive: {
          DEFAULT: "rgb(205 92 92)",
          foreground: "rgb(252 250 247)",
        },
        card: {
          DEFAULT: "rgb(252 250 247)", // Coconut
          foreground: "rgb(0 95 115)", // Ocean Deep
        },
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        lg: "0.5rem", // Consistent md radius
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        'coastal': '0 2px 8px 0 rgba(0, 95, 115, 0.08)',
        'elevated': '0 4px 12px 0 rgba(0, 95, 115, 0.12)',
        'navigation': '0 1px 3px 0 rgba(0, 95, 115, 0.1), 0 1px 2px 0 rgba(0, 95, 115, 0.06)',
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
