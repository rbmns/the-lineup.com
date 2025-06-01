
import React from 'react';
import { EventFilterBar } from '@/components/events/filters/EventFilterBar';

interface EventsFilterBarProps {
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  hasActiveFilters: boolean;
  isAllSelected?: boolean;
}

export const EventsFilterBar: React.FC<EventsFilterBarProps> = ({
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll,
  hasActiveFilters,
  isAllSelected = false
}) => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <EventFilterBar
        allEventTypes={allEventTypes}
        selectedEventTypes={selectedCategories}
        onToggleEventType={toggleCategory}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        hasActiveFilters={hasActiveFilters}
        className="w-full"
      />
    </div>
  );
};
