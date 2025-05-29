
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CategoryBadge from "@/components/polymet/category-badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: CategoryFilterProps) {
  // Function to determine if a category is selected
  const isSelected = (category: string): boolean => {
    return selectedCategory?.toLowerCase() === category.toLowerCase();
  };

  // Function to get the appropriate style classes for a category button
  const getCategoryButtonClasses = (category: string): string => {
    return isSelected(category)
      ? "opacity-100"
      : "opacity-80 hover:opacity-100";
  };

  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          <button
            onClick={() => onSelectCategory("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-secondary hover:bg-secondary-90 text-primary"
            )}
          >
            All categories
          </button>

          {categories.map((category) => {
            // Determine if this category is selected
            const isActive = isSelected(category);

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={cn(
                  "flex items-center rounded-full px-1 transition-opacity",
                  getCategoryButtonClasses(category)
                )}
              >
                <CategoryBadge
                  category={category}
                  size="lg"
                  className={isActive ? "shadow-sm" : ""}
                />
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
