
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: '#D6D6D6', // Secondary/75 from palette
        input: '#121212',  // Primary from palette
        ring: '#000000',
        background: '#FFFFFF', // White background
        foreground: '#121212', // Primary from palette
        primary: {
          DEFAULT: '#121212', // Primary from palette
          90: '#2A2A2A',     // Primary/90 from palette
          75: '#494949',     // Primary/75 from palette
          50: '#808080',     // Primary/50 from palette
          25: '#C0C0C0',     // Primary/25 from palette
          10: '#E6E6E6',     // Primary/10 from palette
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F5F5F5', // Secondary from palette
          90: '#E8E8E8',     // Secondary/90 from palette
          75: '#D6D6D6',     // Secondary/75 from palette
          50: '#B8B8B8',     // Secondary/50 from palette
          25: '#F9F9F9',     // Secondary/25 from palette
          10: '#FCFCFC',     // Secondary/10 from palette
          foreground: '#121212'
        },
        accent: {
          DEFAULT: '#F5F5F5', // Accent from palette
          90: '#E8E8E8',     // Accent/90 from palette
          75: '#D6D6D6',     // Accent/75 from palette
          50: '#B8B8B8',     // Accent/50 from palette
          25: '#F9F9F9',     // Accent/25 from palette
          10: '#FCFCFC',     // Accent/10 from palette
          foreground: '#121212'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#121212'
        },
        // Vibrant colors from the palette
        teal: {
          DEFAULT: '#00CCCC', // Teal from palette
          foreground: '#FFFFFF'
        },
        purple: {
          DEFAULT: '#9966FF', // Purple from palette
          foreground: '#FFFFFF'
        },
        pink: {
          DEFAULT: '#FF66B2', // Pink from palette
          foreground: '#FFFFFF'
        },
        amber: {
          DEFAULT: '#FF9933', // Amber from palette
          foreground: '#FFFFFF'
        },
        lime: {
          DEFAULT: '#99CC33', // Lime from palette
          foreground: '#FFFFFF'
        },
        rose: {
          DEFAULT: '#FF6666', // Rose from palette
          foreground: '#FFFFFF'
        },
        
        // Nature-inspired colors from the new palette
        ocean: {
          deep: '#005F73',
          medium: '#0099CC',
          light: '#94D2BD',
          foam: '#E9F5F5',
          DEFAULT: '#0099CC',
          foreground: '#FFFFFF'
        },
        sand: {
          DEFAULT: '#FFCC99',
          foreground: '#121212'
        },
        sunset: {
          DEFAULT: '#FF9933',
          foreground: '#FFFFFF'
        },
        coral: {
          DEFAULT: '#FF6666',
          foreground: '#FFFFFF'
        },
        amber: {
          DEFAULT: '#EE9B00',
          sandstone: '#CA6702',
          foreground: '#FFFFFF'
        },
        leaf: {
          DEFAULT: '#66CC66',
          foreground: '#FFFFFF'
        },
        lime: {
          DEFAULT: '#99CC33',
          foreground: '#FFFFFF'
        },
        jungle: {
          DEFAULT: '#2D6A4F',
          palm: '#40916C',
          moss: '#74C69D',
          foreground: '#FFFFFF'
        },
        dawn: {
          DEFAULT: '#FFADAD',
          foreground: '#121212'
        },
        dusk: {
          DEFAULT: '#9966FF',
          foreground: '#FFFFFF'
        },
        daylight: {
          DEFAULT: '#AED9E0',
          foreground: '#121212'
        },
        twilight: {
          DEFAULT: '#5E60CE',
          foreground: '#FFFFFF'
        },
        night: {
          DEFAULT: '#3a0CA3',
          foreground: '#FFFFFF'
        },
        
        // Status colors from palette
        destructive: {
          DEFAULT: '#FF3333', // Destructive from palette
          foreground: '#FFFFFF'
        },
        success: {
          DEFAULT: '#33CC66', // Success from palette
          foreground: '#FFFFFF'
        },
        warning: {
          DEFAULT: '#FF9933', // Warning from palette
          foreground: '#FFFFFF'
        },
        info: {
          DEFAULT: '#0099FF', // Info from palette
          foreground: '#FFFFFF'
        }
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Playfair Display', 'serif'],
        display: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: 'Inter',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              fontWeight: '800',
              letterSpacing: '-0.025em',
              '@screen lg': {
                fontSize: '3rem',
                lineHeight: '1',
              },
            },
            h2: {
              fontFamily: 'Inter',
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h3: {
              fontFamily: 'Inter',
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h4: {
              fontFamily: 'Inter',
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            p: {
              fontFamily: 'Inter',
              fontSize: '1rem',
              lineHeight: '1.75rem',
            },
            '.text-xl': {
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
            },
            '.text-sm': {
              fontSize: '0.875rem',
              lineHeight: '1.5rem',
            },
          },
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
      keyframes: {
        "accordion-down": {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        "accordion-up": {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "border-pulse": {
          "0%, 100%": { borderColor: "#121212" },
          "50%": { borderColor: "#12121280" }
        },
        "button-pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" }
        },
        "slide-in-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "border-pulse": "border-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "button-pulse": "button-pulse 2s infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.3s ease-out",
        "slide-in-top": "slide-in-top 0.3s ease-out"
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
