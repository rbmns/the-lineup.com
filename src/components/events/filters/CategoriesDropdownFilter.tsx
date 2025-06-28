
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
          className="flex items-center gap-2 h-10 px-3 border-sage/40 bg-coconut text-midnight rounded-md font-mono text-xs font-medium hover:bg-sage/20 hover:border-sage/60 transition-all duration-200"
        >
          <Grid3X3 className="h-4 w-4 text-ocean-deep" />
          <span className="lowercase">{displayText}</span>
          {selectedCategories.length > 0 && (
            <span className="px-1.5 py-0.5 bg-clay/10 text-midnight/90 rounded-full text-xs font-medium">
              {selectedCategories.length}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-driftwood" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-coconut border-sage/40 shadow-elevated rounded-md" align="start">
        <div className="py-2">
          {/* All Categories option */}
          <button
            onClick={handleSelectAll}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-sage/20 transition-colors font-mono ${
              selectedCategories.length === 0 ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-midnight'
            }`}
          >
            All Categories
          </button>
          
          {/* Divider */}
          <div className="border-t border-sage/30 my-1" />
          
          {/* Categories list */}
          {allEventTypes.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => onToggleCategory(category)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-sage/20 transition-colors lowercase font-mono flex items-center gap-2 ${
                  selectedCategories.includes(category) ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-midnight'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {category}
              </button>
            );
          })}
          
          {allEventTypes.length === 0 && (
            <div className="px-4 py-2 text-sm text-driftwood font-mono">
              No categories available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
