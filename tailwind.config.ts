
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
        background: "rgb(248 246 242)", // Warm neutral
        foreground: "rgb(45 45 43)", // Dark charcoal
        
        // Editorial color palette
        'charcoal': 'rgb(45 45 43)',
        'warm-neutral': 'rgb(248 246 242)', 
        'soft-neutral': 'rgb(252 251 249)',
        'clay-muted': 'rgb(231 225 216)',
        'overcast': 'rgb(180 178 174)',
        'seafoam': 'rgb(162 180 178)',
        'seafoam-soft': 'rgb(162 180 178 / 0.1)',
        'clay': 'rgb(186 162 138)',
        
        primary: {
          DEFAULT: "rgb(45 45 43)", // Charcoal
          foreground: "rgb(248 246 242)",
        },
        secondary: {
          DEFAULT: "rgb(231 225 216)", // Clay muted
          foreground: "rgb(45 45 43)",
        },
        muted: {
          DEFAULT: "rgb(180 178 174)", // Overcast
          foreground: "rgb(45 45 43)",
        },
        accent: {
          DEFAULT: "rgb(162 180 178)", // Seafoam
          foreground: "rgb(45 45 43)",
        },
        destructive: {
          DEFAULT: "rgb(205 92 92)",
          foreground: "rgb(248 246 242)",
        },
        card: {
          DEFAULT: "rgb(252 251 249)",
          foreground: "rgb(45 45 43)",
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
            transform: "translateY(8px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
