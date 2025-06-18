
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
        background: "#F4E7D3", // Updated to Sand Beige
        foreground: "#005F73", // Updated to Ocean Deep
        primary: {
          DEFAULT: "#005F73", // Ocean Deep - Primary brand color
          75: "#337D8D", // Lighter shade of Ocean Deep
          50: "#669BA7", // Even lighter shade
          25: "#99B9C1", // Very light shade
          10: "#E6EEF0", // Almost white with a hint of Ocean Deep
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F4E7D3", // Sand Beige - Background color
          50: "#F9F3E9", // Lighter Sand Beige
          25: "#FCF9F4", // Even lighter Sand Beige
          10: "#FEFCFA", // Almost white with a hint of Sand Beige
          foreground: "#005F73",
        },
        vibrant: {
          sunset: "#FF9933", // Sunset Orange - Accent color
          coral: "#FF6B4A", // Alternative accent
          sand: "#F4E7D3", // Sand Beige
          seafoam: "#66B2B2", // Complementary to Ocean Deep
        },
        nature: {
          ocean: "#005F73", // Ocean Deep
          sand: "#F4E7D3", // Sand Beige
          coral: "#FF6B4A", // Coral accent
          seafoam: "#66B2B2", // Seafoam accent
        },
        neutral: {
          DEFAULT: "#8C8C89", // Driftwood Gray - Text color
          75: "#A3A3A1", // Lighter Driftwood
          50: "#BABAB8", // Even lighter Driftwood
          25: "#D1D1D0", // Very light Driftwood
          10: "#E8E8E7", // Almost white with a hint of Driftwood
        },
        status: {
          success: "#66B2B2", // Seafoam for success
          warning: "#FF9933", // Sunset Orange for warning
          error: "#FF6B4A", // Coral for error
          info: "#005F73", // Ocean Deep for info
        },
        extended: {
          oceanDeep: {
            950: "#004A5A",
            900: "#005366",
            800: "#005F73", // Base Ocean Deep
            700: "#006B80",
            600: "#00778D",
            500: "#00839A",
            400: "#1A8FA5",
            300: "#339BB0",
            200: "#4DA7BB",
            100: "#66B3C5",
            50: "#B2D9E2",
          },
        },
        destructive: {
          DEFAULT: "#FF6B4A", // Updated to Coral
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#8C8C89", // Updated to Driftwood Gray
          foreground: "#005F73",
        },
        accent: {
          DEFAULT: "#66B2B2", // Updated to Seafoam
          foreground: "#005F73",
        },
        // Legacy colors for backwards compatibility
        'brand-turquoise': '#66B2B2',
        'brand-seafoam': '#66B2B2',
        'brand-neutral-bg': '#F4E7D3',
        'brand-text-primary': '#005F73',
        'brand-text-secondary': '#8C8C89',
        'brand-muted': '#8C8C89',
        'brand-online-green': '#66B2B2',
        'brand-away-orange': '#FF9933',
        'ocean-deep': '#005F73',
        'sunset-yellow': '#FF9933',
        'seafoam-green': '#66B2B2',
        'clay-earth': '#A17C6B',
        'pastel-turquoise': '#E6EEF0',
        'pastel-coral': '#F9F3E9',
      },
      boxShadow: {
        'turquoise': '0 4px 24px 0 rgba(0,95,115,0.08)',
        'card-lg': '0 8px 40px 0 rgba(0,95,115,0.10)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #005F73, #66B2B2)',
        'zone-main': 'linear-gradient(to bottom, #F4E7D3 0%, #FFFFFF 100%)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "0.75rem",
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
