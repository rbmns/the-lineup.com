
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
  onReset,
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
  
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
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
            showIcon={false} // Based on your design images, icons aren't shown
            size="default"
          />
        ))}
      </div>
    </div>
  );
};
