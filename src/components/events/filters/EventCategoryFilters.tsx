
import React from 'react';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';

interface EventCategoryFiltersProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset?: () => void;
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
  const isAllSelected = selectedEventTypes.length === allEventTypes.length;
  const isAnySelected = selectedEventTypes.length > 0;
  
  const handleAllClick = () => {
    if (isAllSelected) {
      // If all are already selected, do nothing (we always want to show results)
      return;
    } else {
      // If not all are selected, select all
      onSelectAll();
    }
  };

  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      <AllCategoryPill
        active={isAllSelected}
        onClick={handleAllClick}
        size="default"
        label="All"
        className="text-sm"
      />
      
      {allEventTypes.map((eventType) => (
        <CategoryPill
          key={eventType}
          category={eventType}
          active={selectedEventTypes.includes(eventType)}
          onClick={() => onToggleEventType(eventType)}
          showIcon={false}
          size="default"
          noBorder={true}
          visuallyInactive={isAllSelected}
        />
      ))}
    </div>
  );
};
