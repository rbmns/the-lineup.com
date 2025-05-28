import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, forwardRef } from "react";

const beachCategoryBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        yoga: "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]",
        surf: "bg-[#0891B2] text-white hover:bg-[#0E7490]",
        music: "bg-[#F43F5E] text-white hover:bg-[#E11D48]",
        market: "bg-[#F59E0B] text-white hover:bg-[#D97706]",
        community: "bg-[#84CC16] text-white hover:bg-[#65A30D]",
        food: "bg-[#EC4899] text-white hover:bg-[#DB2777]",
        culture: "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]",
        festival: "bg-[#F43F5E] text-white hover:bg-[#E11D48]",
        sport: "bg-[#10B981] text-white hover:bg-[#059669]",
        art: "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]",
        wellness: "bg-[#06B6D4] text-white hover:bg-[#0891B2]",
        default: "bg-[#0891B2] text-white hover:bg-[#0E7490]",
      },
      size: {
        sm: "text-xs px-2.5 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-1.5",
      },
      gradient: {
        none: "",
        subtle: "bg-gradient-to-r",
        vibrant: "bg-gradient-to-r shadow-sm",
      },
    },
    compoundVariants: [
      {
        variant: "yoga",
        gradient: "subtle",
        className: "from-[#8B5CF6] to-[#A78BFA]",
      },
      {
        variant: "yoga",
        gradient: "vibrant",
        className: "from-[#8B5CF6] to-[#C4B5FD]",
      },
      {
        variant: "surf",
        gradient: "subtle",
        className: "from-[#0891B2] to-[#22D3EE]",
      },
      {
        variant: "surf",
        gradient: "vibrant",
        className: "from-[#0891B2] to-[#67E8F9]",
      },
      {
        variant: "music",
        gradient: "subtle",
        className: "from-[#F43F5E] to-[#FB7185]",
      },
      {
        variant: "music",
        gradient: "vibrant",
        className: "from-[#F43F5E] to-[#FDA4AF]",
      },
      {
        variant: "market",
        gradient: "subtle",
        className: "from-[#F59E0B] to-[#FCD34D]",
      },
      {
        variant: "market",
        gradient: "vibrant",
        className: "from-[#F59E0B] to-[#FDE68A]",
      },
      {
        variant: "community",
        gradient: "subtle",
        className: "from-[#84CC16] to-[#A3E635]",
      },
      {
        variant: "community",
        gradient: "vibrant",
        className: "from-[#84CC16] to-[#BEF264]",
      },
      {
        variant: "food",
        gradient: "subtle",
        className: "from-[#EC4899] to-[#F472B6]",
      },
      {
        variant: "food",
        gradient: "vibrant",
        className: "from-[#EC4899] to-[#F9A8D4]",
      },
      {
        variant: "culture",
        gradient: "subtle",
        className: "from-[#8B5CF6] to-[#A78BFA]",
      },
      {
        variant: "culture",
        gradient: "vibrant",
        className: "from-[#8B5CF6] to-[#C4B5FD]",
      },
      {
        variant: "festival",
        gradient: "subtle",
        className: "from-[#F43F5E] to-[#FB7185]",
      },
      {
        variant: "festival",
        gradient: "vibrant",
        className: "from-[#F43F5E] to-[#FDA4AF]",
      },
      {
        variant: "sport",
        gradient: "subtle",
        className: "from-[#10B981] to-[#34D399]",
      },
      {
        variant: "sport",
        gradient: "vibrant",
        className: "from-[#10B981] to-[#6EE7B7]",
      },
      {
        variant: "art",
        gradient: "subtle",
        className: "from-[#8B5CF6] to-[#A78BFA]",
      },
      {
        variant: "art",
        gradient: "vibrant",
        className: "from-[#8B5CF6] to-[#C4B5FD]",
      },
      {
        variant: "wellness",
        gradient: "subtle",
        className: "from-[#06B6D4] to-[#22D3EE]",
      },
      {
        variant: "wellness",
        gradient: "vibrant",
        className: "from-[#06B6D4] to-[#67E8F9]",
      },
      {
        variant: "default",
        gradient: "subtle",
        className: "from-[#0891B2] to-[#22D3EE]",
      },
      {
        variant: "default",
        gradient: "vibrant",
        className: "from-[#0891B2] to-[#67E8F9]",
      },
    ],

    defaultVariants: {
      variant: "default",
      size: "md",
      gradient: "none",
    },
  }
);

export interface BeachThemeCategoryBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof beachCategoryBadgeVariants> {
  category?: string;
}

const categoryToVariant = (category: string = ""): string => {
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes("yoga")) return "yoga";
  if (lowerCategory.includes("surf")) return "surf";
  if (lowerCategory.includes("music")) return "music";
  if (lowerCategory.includes("market")) return "market";
  if (lowerCategory.includes("community")) return "community";
  if (lowerCategory.includes("food")) return "food";
  if (lowerCategory.includes("culture")) return "culture";
  if (lowerCategory.includes("festival")) return "festival";
  if (lowerCategory.includes("sport")) return "sport";
  if (lowerCategory.includes("art")) return "art";
  if (lowerCategory.includes("wellness")) return "wellness";

  return "default";
};

const BeachThemeCategoryBadge = forwardRef<
  HTMLSpanElement,
  BeachThemeCategoryBadgeProps
>(({ className, variant, size, gradient, category, ...props }, ref) => {
  // If category is provided, use it to determine the variant
  const resolvedVariant = category
    ? (categoryToVariant(category) as any)
    : variant;

  return (
    <span
      className={cn(
        beachCategoryBadgeVariants({
          variant: resolvedVariant,
          size,
          gradient,
          className,
        })
      )}
      ref={ref}
      {...props}
    >
      {props.children || category}
    </span>
  );
});

BeachThemeCategoryBadge.displayName = "BeachThemeCategoryBadge";

export { BeachThemeCategoryBadge, beachCategoryBadgeVariants };
