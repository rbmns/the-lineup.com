
import React from 'react';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventCategoryFiltersProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset: () => void;
  className?: string;
}

export const EventCategoryFilters: React.FC<EventCategoryFiltersProps> = ({
  allEventTypes,
  selectedEventTypes,
  onToggleEventType,
  onSelectAll,
  onDeselectAll,
  onReset,
  className
}) => {
  const allSelected = allEventTypes.length > 0 && allEventTypes.length === selectedEventTypes.length;
  const noneSelected = selectedEventTypes.length === 0;
  
  // If no filters are selected (empty array), treat as "all selected" for UX purposes
  const effectiveSelectedTypes = noneSelected ? allEventTypes : selectedEventTypes;
  
  // Handle the "All" pill click
  const handleAllClick = () => {
    if (allSelected) {
      onDeselectAll();
      toast({ title: "Showing specific categories only" });
    } else {
      onSelectAll();
      toast({ title: "Showing all categories" });
    }
  };
  
  // Handle individual category click
  const handleCategoryClick = (category: string) => {
    if (allSelected) {
      // If all are selected and user clicks one, deselect all others and select only this one
      const newSelection = [category];
      // We can't directly call onToggleEventType here since we need to replace the entire selection
      // Instead, deselect all first then add the clicked category
      onDeselectAll();
      setTimeout(() => {
        onToggleEventType(category);
      }, 0);
      toast({ title: `Showing only ${category} events` });
    } else {
      // Normal toggle behavior for subsequent clicks
      onToggleEventType(category);
    }
  };
  
  // Show reset option only when some filters are selected but not all
  const showResetOption = selectedEventTypes.length > 0 && !allSelected;
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Event Categories</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {/* Add an "All" filter option */}
          <AllCategoryPill
            active={allSelected}
            onClick={handleAllClick}
            size="default"
          />

          {/* Show the category pills */}
          {allEventTypes.map((category) => (
            <CategoryPill
              key={category}
              category={category}
              active={effectiveSelectedTypes.includes(category)} 
              onClick={() => handleCategoryClick(category)}
              showIcon={true}
              size="default"
            />
          ))}
        </div>
        
        {showResetOption && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1"
          >
            <X className="h-3.5 w-3.5" />
            Reset to all
          </Button>
        )}
      </div>
    </div>
  );
};
