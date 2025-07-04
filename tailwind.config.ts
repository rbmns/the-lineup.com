
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
        
        // The Lineup Warm Coastal Palette - Human-centered with soft sunset tones
        'pure-white': '#FFFFFF',
        'coconut': '#FEFCFB', // Soft cream background instead of pure white
        'sand-pink': '#FBE9E7', // Light background tint for section dividers
        'coastal-haze': '#F2F8F8', // Subtle light blue-grey for backgrounds
        'graphite-grey': '#333333', // Warmer, more readable dark grey
        'ocean-deep': '#1a2332', // Almost black for main navigation
        'mist-grey': '#ECEFF1',
        'ocean-teal': '#00A389', // Keep as secondary
        'sunrise-ochre': '#E6AA68',
        'carbon-black': '#000000',
        
        // New Warm Coastal Accent Colors
        'seafoam-drift': '#A9D1C1', // Soft green accent
        'dusk-coral': '#C47D68', // Warm coral for hover states and metadata
        'sunset-orange': '#EE6C4D', // Primary warm accent
        'horizon-blue': '#6FA1B3', // Calm blue accent
        
        primary: {
          DEFAULT: "#EE6C4D", // sunset-orange as new primary
          foreground: "#FFFFFF", // pure-white
        },
        secondary: {
          DEFAULT: "#333333", // updated graphite-grey
          foreground: "#FFFFFF", // pure-white
        },
        muted: {
          DEFAULT: "#ECEFF1", // mist-grey
          foreground: "#333333", // updated graphite-grey
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
          DEFAULT: "#FEFCFB", // coconut instead of pure white
          foreground: "#333333", // updated graphite-grey
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
        'large': ['1.25rem', { lineHeight: '1.6' }], // 20px
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
        'xl': '0 20px 25px -5px rgba(44, 62, 80, 0.1), 0 10px 10px -5px rgba(44, 62, 80, 0.04)',
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
        "slide-up": {
          "0%": {
            transform: "translateY(10px)",
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
        "slide-up": "slide-up 0.3s ease-out",
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
