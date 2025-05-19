
import React from 'react';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pill';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  onReset,
  hasActiveFilters,
  onClearAllFilters,
  className
}) => {
  const isAllSelected = selectedEventTypes.length === allEventTypes.length;
  const someSelected = selectedEventTypes.length > 0 && !isAllSelected;
  
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
    <div className={cn("space-y-4", className)}>
      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="flex gap-2 min-w-max">
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
              onClick={() => onToggleEventType(eventType)}
              showIcon={false}
              size="default"
              noBorder={true}
            />
          ))}
        </div>
      </div>
      
      {selectedEventTypes.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            {isAllSelected ? (
              <>
                <X className="h-3.5 w-3.5" />
                <span>Deselect all</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Select all</span>
              </>
            )}
          </Button>
          
          {someSelected && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-gray-600 hover:text-gray-900"
            >
              Reset
            </Button>
          )}
          
          {hasActiveFilters && onClearAllFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-red-500 hover:text-red-700"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
