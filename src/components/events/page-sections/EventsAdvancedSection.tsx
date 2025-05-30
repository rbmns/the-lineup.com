
import React from 'react';
import AdvancedFilters from '@/components/polymet/advanced-filters';

interface EventsAdvancedSectionProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  dateRange: any;
  selectedDateFilter: string;
  filteredEventsCount: number;
}

export const EventsAdvancedSection: React.FC<EventsAdvancedSectionProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  dateRange,
  selectedDateFilter,
  filteredEventsCount,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Refine your search</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <AdvancedFilters
          onFilterChange={onFilterChange}
          locations={["Zandvoort Area"]}
          initialFilters={{
            location: "Zandvoort Area",
            eventTypes: selectedEventTypes,
            venues: selectedVenues,
            date: dateRange?.from,
            dateFilter: selectedDateFilter
          }}
        />
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {filteredEventsCount} events found
        </span>
      </div>
    </div>
  );
};
