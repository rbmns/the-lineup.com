
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
    <div className="w-full bg-white rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Filter Events</h2>
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
