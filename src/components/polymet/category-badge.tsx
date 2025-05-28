import { cn } from "@/lib/utils";
import { badgeVariants } from "@/polymet/components/color-system";
import {
  MusicIcon,
  SunIcon,
  UsersIcon,
  ShapesIcon,
  WavesIcon,
  UtensilsIcon,
  ShoppingBagIcon,
  CalendarIcon,
  HeartIcon,
  GlobeIcon,
  PaintbrushIcon,
  ZapIcon,
  MountainIcon,
  PartyPopperIcon,
  TentIcon,
  GamepadIcon,
  HelpCircleIcon,
  ActivityIcon,
  UmbrellaIcon,
  CoffeeIcon,
} from "lucide-react";

// Map of category to icon
const categoryIcons = {
  // Event categories
  festival: CalendarIcon,
  kite: MountainIcon,
  beach: UmbrellaIcon,
  game: GamepadIcon,
  sports: ActivityIcon,
  surf: WavesIcon,
  party: PartyPopperIcon,
  yoga: ShapesIcon,
  community: UsersIcon,
  music: MusicIcon,
  food: UtensilsIcon,
  market: ShoppingBagIcon,
  culture: GlobeIcon,
  other: HelpCircleIcon,

  // Vibes
  chill: SunIcon,
  wellness: ShapesIcon,
  active: ZapIcon,
  social: UsersIcon,
  creative: PaintbrushIcon,
};

// Map category to variant
const getCategoryVariant = (category: string) => {
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes("community")) return "community";
  if (lowerCategory.includes("culture") || lowerCategory.includes("art"))
    return "culture";
  if (lowerCategory.includes("food")) return "food";
  if (lowerCategory.includes("market")) return "market";
  if (lowerCategory.includes("music")) return "music";
  if (lowerCategory.includes("sport")) return "sports";
  if (lowerCategory.includes("yoga") || lowerCategory.includes("wellness"))
    return "yoga";
  if (lowerCategory.includes("beach")) return "beach";
  if (lowerCategory.includes("surf")) return "surf";
  if (lowerCategory.includes("festival")) return "festival";
  if (lowerCategory.includes("game")) return "game";
  if (lowerCategory.includes("party")) return "party";
  if (lowerCategory.includes("kite")) return "kite";
  if (lowerCategory.includes("chill")) return "chill";
  if (lowerCategory.includes("active")) return "active";
  if (lowerCategory.includes("social")) return "social";
  if (lowerCategory.includes("creative")) return "creative";

  // Default to primary color if no match
  return "default";
};

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "category" | "vibe";
}

export default function CategoryBadge({
  category,
  size = "md",
  className,
  type = "category",
}: CategoryBadgeProps) {
  // Get the appropriate icon component
  const IconComponent =
    categoryIcons[category.toLowerCase()] || categoryIcons.other;

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  // Only show icon on large size
  const showIcon = size === "lg";

  return (
    <span
      className={cn(
        badgeVariants({ variant: getCategoryVariant(category) }),
        sizeClasses[size],
        "inline-flex items-center gap-1",
        className
      )}
    >
      {showIcon && <IconComponent size={14} />}
      {category}
    </span>
  );
}
