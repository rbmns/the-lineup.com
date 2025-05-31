
import React, { memo } from 'react';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';

interface EventCategoryFiltersProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset?: () => void;
  className?: string;
}

export const EventCategoryFilters: React.FC<EventCategoryFiltersProps> = memo(({
  allEventTypes,
  selectedEventTypes,
  onToggleEventType,
  onSelectAll,
  onDeselectAll,
  onReset,
  className
}) => {
  const isAllSelected = selectedEventTypes.length === allEventTypes.length;
  const isNoneSelected = selectedEventTypes.length === 0;
  
  const handleAllClick = () => {
    if (isAllSelected || selectedEventTypes.length > 0) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  // Use memo to prevent unnecessary recreations of this function
  const handleToggleEventType = React.useCallback((eventType: string) => {
    onToggleEventType(eventType);
  }, [onToggleEventType]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Tag className="h-4 w-4" />
        <span>Filter by Category</span>
        {selectedEventTypes.length > 0 && selectedEventTypes.length < allEventTypes.length && (
          <span className="text-xs text-gray-500">({selectedEventTypes.length})</span>
        )}
      </div>
      
      <div className="flex gap-2 flex-wrap overflow-x-auto pb-2 no-scrollbar">
        <AllCategoryPill
          active={isNoneSelected || isAllSelected}
          onClick={handleAllClick}
          size="default"
          className="text-sm !border-0 border-none"
        />
        
        {allEventTypes.map((eventType) => (
          <CategoryPill
            key={eventType}
            category={eventType}
            active={selectedEventTypes.includes(eventType)}
            onClick={() => handleToggleEventType(eventType)}
            showIcon={false}
            size="default"
            noBorder={true}
            className="!border-0 border-none"
          />
        ))}
      </div>
    </div>
  );
});

// Add display name for better debugging
EventCategoryFilters.displayName = 'EventCategoryFilters';
