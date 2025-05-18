
import React from 'react';
import { EventCategoryFilters } from './EventCategoryFilters';
import { cn } from '@/lib/utils';

interface EventFilterBarProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset?: () => void;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
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
  return (
    <div className={cn("overflow-x-auto whitespace-nowrap pb-1", className)}>
      <EventCategoryFilters
        allEventTypes={allEventTypes}
        selectedEventTypes={selectedEventTypes}
        onToggleEventType={onToggleEventType}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onReset={onReset}
      />
    </div>
  );
};
