import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

interface CategoryFilterStatesProps {
  className?: string;
}

export default function CategoryFilterStates({
  className,
}: CategoryFilterStatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "All categories",
    "Yoga",
    "Sports",
    "Music",
    "Food",
    "Beach",
    "Community",
    "Culture",
    "Market",
    "Surf",
    "Festival",
  ];

  const getCategoryColor = (category: string, isSelected: boolean): string => {
    if (category.toLowerCase() === "all categories") {
      return isSelected
        ? "bg-primary text-white hover:bg-primary/90"
        : "bg-secondary hover:bg-secondary-90 text-primary";
    }

    const normalizedCategory = category.toLowerCase();

    if (isSelected) {
      switch (normalizedCategory) {
        case "yoga":
          return "bg-green-600 text-white hover:bg-green-700";
        case "sports":
          return "bg-red-600 text-white hover:bg-red-700";
        case "music":
          return "bg-rose-600 text-white hover:bg-rose-700";
        case "food":
          return "bg-orange-600 text-white hover:bg-orange-700";
        case "beach":
          return "bg-yellow-600 text-white hover:bg-yellow-700";
        case "community":
          return "bg-violet-600 text-white hover:bg-violet-700";
        case "culture":
          return "bg-pink-600 text-white hover:bg-pink-700";
        case "market":
          return "bg-lime-600 text-white hover:bg-lime-700";
        case "surf":
          return "bg-blue-600 text-white hover:bg-blue-700";
        case "festival":
          return "bg-amber-600 text-white hover:bg-amber-700";
        default:
          return "bg-primary text-white hover:bg-primary/90";
      }
    } else {
      switch (normalizedCategory) {
        case "yoga":
          return "bg-green-100 text-green-800 hover:bg-green-200";
        case "sports":
          return "bg-red-100 text-red-800 hover:bg-red-200";
        case "music":
          return "bg-rose-100 text-rose-800 hover:bg-rose-200";
        case "food":
          return "bg-orange-100 text-orange-800 hover:bg-orange-200";
        case "beach":
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
        case "community":
          return "bg-violet-100 text-violet-800 hover:bg-violet-200";
        case "culture":
          return "bg-pink-100 text-pink-800 hover:bg-pink-200";
        case "market":
          return "bg-lime-100 text-lime-800 hover:bg-lime-200";
        case "surf":
          return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        case "festival":
          return "bg-amber-100 text-amber-800 hover:bg-amber-200";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      }
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-lg font-semibold mb-4">
        Category Filter States Example
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Click on categories to see active/inactive states. Active categories use
        a darker, more saturated color with white text, while inactive
        categories use a lighter pastel color with dark text.
      </p>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.toLowerCase();
            const colorClasses = getCategoryColor(category, isSelected);

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  colorClasses
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>

      <div className="mt-8">
        <h3 className="text-md font-medium mb-3">Active vs Inactive States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Active State</h4>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-green-600 text-white px-4 py-1.5 text-sm font-medium">
                Yoga
              </span>
              <span className="inline-flex items-center rounded-full bg-red-600 text-white px-4 py-1.5 text-sm font-medium">
                Sports
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-4 py-1.5 text-sm font-medium">
                Surf
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Active categories use darker, saturated colors with white text for
              high contrast
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Inactive State</h4>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-4 py-1.5 text-sm font-medium">
                Yoga
              </span>
              <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 px-4 py-1.5 text-sm font-medium">
                Sports
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-4 py-1.5 text-sm font-medium">
                Surf
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Inactive categories use lighter, pastel colors with dark text for
              a subtle appearance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
