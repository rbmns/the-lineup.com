
import React from 'react';
import { cn } from '@/lib/utils';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pills';

interface EventFilterBarProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset: () => void;
  hasActiveFilters?: boolean;
  onClearAllFilters?: () => void;
  className?: string;
}

export const EventFilterBar: React.FC<EventFilterBarProps> = ({
  allEventTypes,
  selectedEventTypes,
  onToggleEventType,
  onSelectAll,
  onDeselectAll,
  className
}) => {
  const allSelected = allEventTypes.length === selectedEventTypes.length;
  
  // Handle the "All" pill click
  const handleAllClick = () => {
    if (allSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  // Fixed height container with overflow for events
  return (
    <div className={cn("w-full overflow-x-auto h-[42px]", className)}>
      <div className="flex items-center space-x-2 min-w-max">
        {/* All button first */}
        <AllCategoryPill
          active={allSelected}
          onClick={handleAllClick}
          size="default"
        />
        
        {/* Individual category pills */}
        {allEventTypes.map((category) => (
          <CategoryPill
            key={category} 
            category={category} 
            active={selectedEventTypes.includes(category)}
            onClick={() => onToggleEventType(category)}
            showIcon={false}
            size="default"
          />
        ))}
      </div>
    </div>
  );
};
