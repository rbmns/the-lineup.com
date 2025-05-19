
import React from 'react';
import { EventFilterBar } from '@/components/events/filters/EventFilterBar';

interface EventsFilterBarProps {
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  hasActiveFilters: boolean;
}

export const EventsFilterBar: React.FC<EventsFilterBarProps> = ({
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll,
  hasActiveFilters
}) => {
  return (
    <div className="mt-2 mb-4 overflow-x-auto">
      <EventFilterBar
        allEventTypes={allEventTypes}
        selectedEventTypes={selectedCategories}
        onToggleEventType={toggleCategory}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        hasActiveFilters={hasActiveFilters}
        className="py-2"
      />
    </div>
  );
};
