
import React from 'react';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

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
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Event Categories</h3>
      </div>
      
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
            onClick={() => onToggleEventType(category)}
            showIcon={true}
            size="default"
          />
        ))}
      </div>
    </div>
  );
};
