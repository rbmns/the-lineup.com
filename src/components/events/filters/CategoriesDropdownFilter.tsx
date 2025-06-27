
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CategoryPill } from '@/components/ui/category-pill';

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

  const displayText = selectedCategories.length === 0 
    ? 'Categories' 
    : selectedCategories.length === 1 
      ? selectedCategories[0] 
      : `${selectedCategories.length} categories`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-gray-300 rounded-lg"
        >
          <span className="text-sm font-medium">{displayText}</span>
          {selectedCategories.length > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {selectedCategories.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Select Categories</h4>
            <div className="flex gap-1">
              <button
                onClick={onSelectAll}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                All
              </button>
              <span className="text-xs text-gray-400">|</span>
              <button
                onClick={onDeselectAll}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                None
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
            {allEventTypes.map((category) => (
              <CategoryPill 
                key={category} 
                category={category} 
                active={selectedCategories.includes(category)}
                onClick={() => onToggleCategory(category)}
                showIcon={false}
                size="sm"
                className="text-xs"
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
