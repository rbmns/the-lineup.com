
import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryFilterSectionProps {
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  className?: string;
}

export const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-1.5">
        {allEventTypes.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full transition-colors border",
              selectedCategories.includes(category)
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={selectAll}
          className="text-xs text-primary hover:text-primary/80"
        >
          Select All
        </button>
        <button
          onClick={deselectAll}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
