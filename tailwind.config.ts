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
      padding: "1rem",
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
        background: "#F3F4F6", // Updated app-wide background
        foreground: "#1F1F1F",
        primary: {
          DEFAULT: "#00A6A6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F9FAFB", // Sidebar and containers
          foreground: "#1F1F1F",
        },
        destructive: {
          DEFAULT: "#FF5C57",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#374151",
        },
        accent: {
          DEFAULT: "#4ADEDE",
          foreground: "#00A6A6",
        },
        'brand-turquoise': '#00A6A6',
        'brand-seafoam': '#4ADEDE',
        'brand-neutral-bg': '#F3F4F6',
        'brand-text-primary': '#1F1F1F',
        'brand-text-secondary': '#374151',
        'brand-muted': '#6B7280',
        'brand-online-green': '#22C55E',
        'brand-away-orange': '#F97316',
        'ocean-deep': '#0C3B5C',
        'sunset-yellow': '#FFCB6B',
        'seafoam-green': '#80D8DA',
        'clay-earth': '#A17C6B',
        'pastel-turquoise': '#E0F7F7',
        'pastel-coral': '#FFEDE8',
      },
      boxShadow: {
        'turquoise': '0 4px 24px 0 rgba(0,166,166,0.08)',
        'card-lg': '0 8px 40px 0 rgba(0,166,166,0.10)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #00A6A6, #4ADEDE)',
        'zone-main': 'linear-gradient(to bottom, #F3F4F6 0%, #FFFFFF 100%)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "0.75rem", // LESS ROUND (was 1.5rem)
      },
      transitionProperty: {
        'coastal': 'box-shadow, background-color, color, transform',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
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
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
