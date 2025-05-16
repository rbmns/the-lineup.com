
import React from 'react';
import { CategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';

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
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Event Categories</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Add an "All" pill at the beginning */}
        <CategoryPill
          key="all-categories"
          category="All"
          active={allSelected}
          onClick={() => allSelected ? onDeselectAll() : onSelectAll()}
          showIcon={true}
          isAll={true}
        />
        
        {/* Individual category pills */}
        {allEventTypes.map((category) => (
          <CategoryPill
            key={category}
            category={category}
            active={selectedEventTypes.includes(category)} 
            onClick={() => onToggleEventType(category)}
            showIcon={true}
            size="default"
          />
        ))}
      </div>
    </div>
  );
};
