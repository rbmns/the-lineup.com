
import { cva } from "class-variance-authority";

// Primary brand colors
export const colors = {
  primary: {
    DEFAULT: "#005F73", // Ocean Deep - Primary brand color
    75: "#337D8D", // Lighter shade of Ocean Deep
    50: "#669BA7", // Even lighter shade
    25: "#99B9C1", // Very light shade
    10: "#E6EEF0", // Almost white with a hint of Ocean Deep
  },
  secondary: {
    DEFAULT: "#F4E7D3", // Sand Beige - Background color
    50: "#F9F3E9", // Lighter Sand Beige
    25: "#FCF9F4", // Even lighter Sand Beige
    10: "#FEFCFA", // Almost white with a hint of Sand Beige
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
};

// Button variants using class-variance-authority
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary",
        secondary:
          "bg-secondary text-primary hover:bg-secondary/90 focus-visible:ring-secondary",
        outline:
          "border border-neutral-25 bg-transparent hover:bg-secondary-10 text-primary",
        ghost: "hover:bg-secondary-10 text-primary hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        vibrant:
          "bg-vibrant-sunset text-white hover:bg-vibrant-sunset/90 focus-visible:ring-vibrant-sunset",
        nature:
          "bg-nature-ocean text-white hover:bg-nature-ocean/90 focus-visible:ring-nature-ocean",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Badge variants using class-variance-authority
export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-primary hover:bg-secondary/80",
        outline: "text-neutral",
        community:
          "border-transparent bg-vibrant-seafoam text-white hover:bg-vibrant-seafoam/80",
        culture:
          "border-transparent bg-vibrant-sunset text-white hover:bg-vibrant-sunset/80",
        food: "border-transparent bg-vibrant-coral text-white hover:bg-vibrant-coral/80",
        market:
          "border-transparent bg-nature-sand text-primary hover:bg-nature-sand/80",
        music:
          "border-transparent bg-extended-oceanDeep-300 text-white hover:bg-extended-oceanDeep-300/80",
        sports:
          "border-transparent bg-vibrant-coral text-white hover:bg-vibrant-coral/80",
        yoga: "border-transparent bg-vibrant-seafoam text-white hover:bg-vibrant-seafoam/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Card variants using class-variance-authority
export const cardVariants = cva("rounded-lg border shadow-sm", {
  variants: {
    variant: {
      default: "bg-white border-secondary-50",
      sunset: "bg-vibrant-sunset/10 border-vibrant-sunset/20",
      coral: "bg-vibrant-coral/10 border-vibrant-coral/20",
      seafoam: "bg-vibrant-seafoam/10 border-vibrant-seafoam/20",
      ocean: "bg-nature-ocean/10 border-nature-ocean/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
