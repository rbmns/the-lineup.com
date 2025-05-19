
import React from 'react';
import { CategoryPill } from '@/components/ui/category-pill';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
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
    // If some or all are selected, deselect all
    // If none are selected, select all
    selectedEventTypes.length > 0 ? onDeselectAll() : onSelectAll();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="flex gap-2 min-w-max">
          <AllCategoryPill
            active={isNoneSelected ? false : true}
            onClick={handleAllToggle}
            size="default"
            isSelectAll={isNoneSelected}
            label={isNoneSelected ? "Select all" : "Deselect all"}
            className="min-w-[115px] justify-center"
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
