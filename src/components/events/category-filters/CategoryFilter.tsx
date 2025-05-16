
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  hasActiveFilters?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  hasActiveFilters = false
}) => {
  const categories = [
    'Music', 'Technology', 'Art', 'Business', 'Food', 'Sports', 
    'Health', 'Education', 'Social', 'Outdoors'
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className={cn("rounded-full", 
            selectedCategory === null ? "bg-purple-600 hover:bg-purple-700" : ""
          )}
        >
          All
        </Button>
        
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={cn("rounded-full",
              selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""
            )}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="mt-2 text-xs h-7"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default CategoryFilter;
