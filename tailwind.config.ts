
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
        
        // The Lineup Adult Minimalist + Coastal Energy Palette
        'pure-white': '#FFFFFF',
        'mist-grey': '#F0F0F0',
        'graphite-grey': '#333333',
        'coastal-haze': '#F2F8F8',
        'seafoam-drift': '#A9D1C1',
        'dusk-coral': '#C47D68',
        'horizon-blue': '#6FA1B3',
        'sunset-orange': '#FF9E00',
        'vibrant-sky': '#90E0EF',
        
        // Legacy compatibility (mapped to new colors)
        'coconut': '#FFFFFF', // Maps to pure-white
        'sand-pink': '#F2F8F8', // Maps to coastal-haze
        'ocean-deep': '#333333', // Maps to graphite-grey
        'ocean-teal': '#6FA1B3', // Maps to horizon-blue
        'sunrise-ochre': '#C47D68', // Maps to dusk-coral
        'carbon-black': '#000000',
        
        primary: {
          DEFAULT: "#333333", // graphite-grey as primary
          foreground: "#FFFFFF", // pure-white
        },
        secondary: {
          DEFAULT: "#F0F0F0", // mist-grey
          foreground: "#333333", // graphite-grey
        },
        muted: {
          DEFAULT: "#F2F8F8", // coastal-haze
          foreground: "#333333", // graphite-grey
        },
        accent: {
          DEFAULT: "#C47D68", // dusk-coral
          foreground: "#FFFFFF", // pure-white
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF", // pure-white
          foreground: "#333333", // graphite-grey
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'display': ['Montserrat', 'sans-serif'], // alias for montserrat
        'body': ['Lato', 'sans-serif'], // alias for lato
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }], // 56px
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }], // 40px
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }], // 32px  
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }], // 24px
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }], // 20px
        'body-base': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
        'body-large': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
        'body-small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
        'label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }], // 14px
        'metadata': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }], // 12px
      },
      borderRadius: {
        xl: "0.75rem", // 12px
        lg: "0.5rem", // 8px - for prominent cards, modals
        md: "0.375rem", // 6px - for most buttons, general cards, inputs
        sm: "0.25rem", // 4px - for very subtle rounding
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
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
            transform: "scale(0.98)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "slide-up": {
          "0%": {
            transform: "translateY(8px)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
