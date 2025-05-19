
import React from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';

interface EventCategoryPillsProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset: () => void;
  className?: string;
  showActions?: boolean;
}

export const EventCategoryPills: React.FC<EventCategoryPillsProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  onDeselectAll,
  onReset,
  className,
  showActions = true
}) => {
  const allSelected = categories.length === selectedCategories.length;
  const someSelected = selectedCategories.length > 0 && !allSelected;
  
  const handleToggleCategory = (category: string) => {
    // If all categories are selected, clicking one should isolate it
    if (allSelected) {
      // We'll handle this in the hook directly
      onToggleCategory(category);
    } else {
      // Normal toggle behavior
      onToggleCategory(category);
    }
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <CategoryPill
            key={category}
            category={category}
            active={selectedCategories.includes(category)}
            onClick={() => handleToggleCategory(category)}
            showIcon={true}
          />
        ))}
      </div>
      
      {showActions && selectedCategories.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            {allSelected ? (
              <>
                <X className="h-3.5 w-3.5" />
                <span>Deselect all</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Select all</span>
              </>
            )}
          </Button>
          
          {someSelected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-gray-600 hover:text-gray-900"
            >
              Reset
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
