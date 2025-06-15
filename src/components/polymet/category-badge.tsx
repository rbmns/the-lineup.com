import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
    categoryIcons[category.toLowerCase() as keyof typeof categoryIcons] || HelpCircleIcon;

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  // Only show icon on large size
  const showIcon = size === "lg";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-1",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <IconComponent size={14} />}
      {category}
    </Badge>
  );
}
