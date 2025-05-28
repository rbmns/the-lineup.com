import { cva } from "class-variance-authority";

// Primary brand colors
export const brandColors = {
  primary: {
    DEFAULT: "#1C1C1C", // Primary text color
    75: "#5C5C5C", // Secondary text color
    50: "#ADADAD", // Tertiary text color
    25: "#D6D6D6", // Quaternary text color
    10: "#F2F2F2", // Background color
  },
  secondary: {
    DEFAULT: "#F7F7F7", // Light background
    50: "#E5E5E5", // Border color
    25: "#F2F2F2", // Card background
    10: "#FAFAFA", // Secondary background
  },
  vibrant: {
    teal: "#005F73", // Primary accent color
    coral: "#EE6C4D", // Secondary accent color
    sunset: "#E9C46A", // Tertiary accent color
    seafoam: "#2A9D8F", // Quaternary accent color
  },
  nature: {
    ocean: "#005F73", // Deep blue-green
    sand: "#E9C46A", // Warm yellow
    coral: "#EE6C4D", // Bright orange-red
    seafoam: "#2A9D8F", // Teal green
  },
  status: {
    success: "#2A9D8F", // Success color
    warning: "#E9C46A", // Warning color
    error: "#EE6C4D", // Error color
    info: "#005F73", // Info color
  },
  extended: {
    oceanDeep: {
      950: "#003944",
      900: "#004352",
      800: "#004D5F",
      700: "#00586D",
      600: "#00637A",
      500: "#005F73", // Base vibrant.teal
      400: "#1A7183",
      300: "#338394",
      200: "#4D95A4",
      100: "#66A7B5",
      50: "#B2D3D9",
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
        sunset:
          "bg-vibrant-sunset text-primary hover:bg-vibrant-sunset/90 focus-visible:ring-vibrant-sunset",
        coral:
          "bg-vibrant-coral text-white hover:bg-vibrant-coral/90 focus-visible:ring-vibrant-coral",
        outline:
          "border border-secondary-50 bg-transparent hover:bg-secondary-10 text-primary",
        ghost: "hover:bg-secondary-10 text-primary hover:text-primary",
        link: "text-vibrant-teal underline-offset-4 hover:underline",
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
        sunset:
          "border-transparent bg-vibrant-sunset text-primary hover:bg-vibrant-sunset/80",
        coral:
          "border-transparent bg-vibrant-coral text-white hover:bg-vibrant-coral/80",
        seafoam:
          "border-transparent bg-vibrant-seafoam text-white hover:bg-vibrant-seafoam/80",
        outline: "text-primary-75",
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

export default brandColors;
