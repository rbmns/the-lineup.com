
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
  const isAllSelected = selectedEventTypes.length === allEventTypes.length || selectedEventTypes.length === 0;
  
  const handleAllClick = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const handleCategoryClick = (eventType: string) => {
    // If All is currently selected, then clicking a specific category should deselect all others
    if (isAllSelected) {
      // Select only this category
      const newSelection = [eventType];
      const selectedTypes = allEventTypes.filter(type => 
        newSelection.includes(type)
      );
      
      // Update the selected event types with only the clicked category
      onDeselectAll(); // First clear all
      // Then manually select just the one that was clicked
      setTimeout(() => onToggleEventType(eventType), 0);
    } else {
      // Normal toggle behavior when not starting from "All" selected
      onToggleEventType(eventType);
    }
  };

  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      <AllCategoryPill
        active={isAllSelected}
        onClick={handleAllClick}
        size="default"
      />
      
      {allEventTypes.map((eventType) => (
        <CategoryPill
          key={eventType}
          category={eventType}
          active={selectedEventTypes.includes(eventType)}
          onClick={() => handleCategoryClick(eventType)}
          showIcon={false}
          size="default"
          noBorder={true}
        />
      ))}
    </div>
  );
};
