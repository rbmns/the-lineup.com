import { cn } from "@/lib/utils";

type CategorySize = "sm" | "md" | "lg";

interface EventCategoryLabelProps {
  category: string;
  size?: CategorySize;
  className?: string;
}

const getCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase();

  switch (normalizedCategory) {
    case "festival":
      return "bg-amber-100 text-amber-800";
    case "wellness":
      return "bg-emerald-100 text-emerald-800";
    case "yoga":
      return "bg-green-100 text-green-800"; // Changed to green
    case "kite":
      return "bg-sky-100 text-sky-800";
    case "beach":
      return "bg-yellow-100 text-yellow-800";
    case "game":
      return "bg-indigo-100 text-indigo-800";
    case "sports":
      return "bg-red-100 text-red-800"; // Changed to red
    case "surf":
      return "bg-blue-100 text-blue-800";
    case "party":
      return "bg-fuchsia-100 text-fuchsia-800";
    case "community":
      return "bg-violet-100 text-violet-800";
    case "water":
      return "bg-cyan-100 text-cyan-800";
    case "music":
      return "bg-rose-100 text-rose-800";
    case "food":
      return "bg-orange-100 text-orange-800";
    case "market":
      return "bg-lime-100 text-lime-800";
    case "culture":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSizeClasses = (size: CategorySize): string => {
  switch (size) {
    case "sm":
      return "text-xs px-2 py-0.5";
    case "lg":
      return "text-sm px-3 py-1";
    case "md":
    default:
      return "text-xs px-2.5 py-0.5";
  }
};

export function EventCategoryLabel({
  category,
  size = "md",
  className,
}: EventCategoryLabelProps) {
  const colorClasses = getCategoryColor(category);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        colorClasses,
        sizeClasses,
        className
      )}
    >
      {category}
    </span>
  );
}

export function EventCategoryLabelsCollection({
  size = "md",
}: {
  size?: CategorySize;
}) {
  const categories = [
    "Festival",
    "Wellness",
    "Kite",
    "Beach",
    "Game",
    "Other",
    "Sports",
    "Surf",
    "Party",
    "Yoga",
    "Community",
    "Water",
    "Music",
    "Food",
    "Market",
    "Culture",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <EventCategoryLabel key={category} category={category} size={size} />
      ))}
    </div>
  );
}
