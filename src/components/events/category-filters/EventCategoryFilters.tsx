
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
  className
}) => {
  const isAllSelected = selectedEventTypes.length === allEventTypes.length;
  const isNoneSelected = selectedEventTypes.length === 0;
  
  const handleAllClick = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      <AllCategoryPill
        active={isAllSelected || isNoneSelected}
        onClick={handleAllClick}
        size="default"
      />
      
      {allEventTypes.map((eventType) => (
        <CategoryPill
          key={eventType}
          category={eventType}
          // Show as active if specifically selected OR if none are selected (meaning all are active by default)
          active={selectedEventTypes.includes(eventType) || isNoneSelected}
          onClick={() => onToggleEventType(eventType)}
          showIcon={false}
          size="default"
          noBorder={true}
        />
      ))}
    </div>
  );
};
