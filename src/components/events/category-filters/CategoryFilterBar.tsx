
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterBarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategories,
  onCategoryChange,
  onClearFilters
}) => {
  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <div className="text-sm text-gray-600">Filters:</div>
      
      {selectedCategories.map(category => (
        <Badge 
          key={category} 
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          {category}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onCategoryChange(category)} 
          />
        </Badge>
      ))}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClearFilters}
        className="text-xs h-7"
      >
        Clear all
      </Button>
    </div>
  );
};

export default CategoryFilterBar;
