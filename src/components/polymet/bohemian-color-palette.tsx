
import { cva } from "class-variance-authority";

export const bohemianColors = {
  primary: "#8B4513",
  secondary: "#F2F0EB",
  accent: {
    teal: "#4A9B9B",
    ochre: "#D2B48C",
    sage: "#87A96B",
    indigo: "#6B73FF"
  },
  earth: {
    terracotta: "#CC7A6B",
    clay: "#A0522D",
    sand: "#F5DEB3"
  },
  overlays: {
    dark: "bg-black/60",
    terracotta: "bg-[#CC7A6B]/40",
    teal: "bg-[#4A9B9B]/40",
    indigo: "bg-[#6B73FF]/40"
  },
  patterns: {
    dots: "bg-[radial-gradient(#8B4513_1px,transparent_1px)] bg-[length:20px_20px]",
    lines: "bg-[linear-gradient(45deg,#8B4513_1px,transparent_1px)] bg-[length:10px_10px]",
    weave: "bg-[repeating-conic-gradient(#8B4513_0deg_90deg,transparent_90deg_180deg)] bg-[length:20px_20px]"
  }
};

export const categoryBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      category: {
        default: "bg-[#8B4513] text-white",
        yoga: "bg-[#87A96B] text-white",
        surf: "bg-[#4A9B9B] text-white",
        music: "bg-[#CC7A6B] text-white",
        market: "bg-[#D2B48C] text-[#8B4513]",
        community: "bg-[#6B73FF] text-white",
        food: "bg-[#CC7A6B] text-white",
        culture: "bg-[#8B4513] text-white",
        festival: "bg-[#CC7A6B] text-white",
        sport: "bg-[#4A9B9B] text-white",
        art: "bg-[#87A96B] text-white",
        wellness: "bg-[#87A96B] text-white"
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1"
      }
    },
    defaultVariants: {
      category: "default",
      size: "md"
    }
  }
);
