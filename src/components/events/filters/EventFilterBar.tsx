
import React from 'react';
import { CategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';
import { AllCategoryPill } from '@/components/ui/category-pill';

interface EventFilterBarProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (eventType: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset?: () => void;
  hasActiveFilters: boolean;
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
  const isAllSelected = selectedEventTypes.length === allEventTypes.length;
  const isNoneSelected = selectedEventTypes.length === 0;
  
  const handleAllToggle = () => {
    if (isAllSelected || selectedEventTypes.length > 0) {
      onDeselectAll(); // Deselect all when any are selected
    } else {
      onSelectAll(); // Select all when none are selected
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="flex gap-2 min-w-max">
          <AllCategoryPill
            active={isNoneSelected || isAllSelected} // Active when none or all are selected
            onClick={handleAllToggle}
            size="default"
            className="min-w-[90px] justify-center text-sm"
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};
