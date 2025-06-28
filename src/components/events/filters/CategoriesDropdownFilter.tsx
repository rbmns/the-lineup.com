
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

  const displayText = selectedCategories.length === 0 ? "CATEGORY" : 
                     selectedCategories.length === 1 ? selectedCategories[0].toUpperCase() : 
                     `${selectedCategories.length} CATEGORIES`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-ocean-deep/20 bg-coconut text-ocean-deep rounded-md font-mono text-xs font-medium uppercase tracking-wide hover:bg-vibrant-aqua/10 hover:border-vibrant-aqua/40 transition-all duration-200"
        >
          <Grid3X3 className="h-4 w-4 text-coral" />
          <span>{displayText}</span>
          {selectedCategories.length > 0 && (
            <span className="px-1.5 py-0.5 bg-sungold/20 text-ocean-deep rounded-full text-xs font-medium">
              {selectedCategories.length}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-ocean-deep/70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-coconut border-ocean-deep/20 shadow-coastal rounded-md" align="start">
        <div className="py-2">
          {/* All Categories option */}
          <button
            onClick={handleSelectAll}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-vibrant-aqua/10 transition-colors font-mono uppercase tracking-wide ${
              selectedCategories.length === 0 ? 'bg-sungold/20 font-medium text-ocean-deep' : 'text-ocean-deep'
            }`}
          >
            all categories
          </button>
          
          {/* Divider */}
          <div className="border-t border-ocean-deep/10 my-1" />
          
          {/* Categories list */}
          {allEventTypes.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => onToggleCategory(category)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-vibrant-aqua/10 transition-colors font-mono uppercase tracking-wide flex items-center gap-2 ${
                  selectedCategories.includes(category) ? 'bg-sungold/20 font-medium text-ocean-deep' : 'text-ocean-deep'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {category}
              </button>
            );
          })}
          
          {allEventTypes.length === 0 && (
            <div className="px-4 py-2 text-sm text-ocean-deep/70 font-mono uppercase tracking-wide">
              No categories available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
