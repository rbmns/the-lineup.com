
import React, { useState } from 'react';
import { ChevronDown, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getCategoryIcon } from '@/components/ui/category/category-icon-mapping';

interface CategoriesDropdownFilterProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  allEventTypes: string[];
}

export const CategoriesDropdownFilter: React.FC<CategoriesDropdownFilterProps> = ({
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  onDeselectAll,
  allEventTypes
}) => {
  const [open, setOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectedCategories.length === allEventTypes.length) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const displayText = selectedCategories.length === 0 ? "Categories" : 
                     selectedCategories.length === 1 ? selectedCategories[0] : 
                     `${selectedCategories.length} categories`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-sage bg-coconut text-midnight rounded-sm font-mono text-sm hover:bg-seafoam hover:border-overcast transition-colors"
        >
          <Grid3X3 className="h-4 w-4 text-gray-400" />
          <span className="capitalize">{displayText}</span>
          {selectedCategories.length > 0 && (
            <span className="px-1.5 py-0.5 bg-seafoam text-midnight rounded-full text-xs font-medium">
              {selectedCategories.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-coconut border-sage" align="start">
        <div className="py-2">
          {/* All Categories option */}
          <button
            onClick={handleSelectAll}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-seafoam transition-colors font-mono ${
              selectedCategories.length === 0 ? 'bg-seafoam font-medium text-midnight' : 'text-midnight'
            }`}
          >
            All Categories
          </button>
          
          {/* Divider */}
          <div className="border-t border-sage my-1" />
          
          {/* Categories list */}
          {allEventTypes.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => onToggleCategory(category)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-seafoam transition-colors capitalize font-mono flex items-center gap-2 ${
                  selectedCategories.includes(category) ? 'bg-seafoam font-medium text-midnight' : 'text-midnight'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {category}
              </button>
            );
          })}
          
          {/* No categories found */}
          {allEventTypes.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500 font-mono">
              No categories available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
