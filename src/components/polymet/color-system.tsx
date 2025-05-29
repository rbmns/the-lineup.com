
import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        
        // Event category variants
        community: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        culture: "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200",
        food: "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200",
        market: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        music: "border-transparent bg-pink-100 text-pink-800 hover:bg-pink-200",
        sports: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        yoga: "border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200",
        beach: "border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
        surf: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        festival: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        game: "border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
        party: "border-transparent bg-rose-100 text-rose-800 hover:bg-rose-200",
        kite: "border-transparent bg-sky-100 text-sky-800 hover:bg-sky-200",
        
        // Vibe variants
        chill: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        active: "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        social: "border-transparent bg-violet-100 text-violet-800 hover:bg-violet-200",
        creative: "border-transparent bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
