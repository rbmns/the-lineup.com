
import React from 'react';
import AdvancedFilters from '@/components/polymet/advanced-filters';
import { DateRange } from 'react-day-picker';

interface EventsAdvancedSectionProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  selectedVibes: string[];
  dateRange: DateRange | undefined;
  selectedDateFilter: string;
  filteredEventsCount: number;
  showLocationFilter?: boolean;
  allEventTypes: string[];
}

export const EventsAdvancedSection: React.FC<EventsAdvancedSectionProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  selectedVibes,
  dateRange,
  selectedDateFilter,
  filteredEventsCount,
  showLocationFilter = true,
  allEventTypes
}) => {
  const handleAdvancedFilterChange = (filters: any) => {
    console.log('EventsAdvancedSection - Filter change:', filters);
    onFilterChange(filters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Advanced Filters</h2>
        <div className="text-sm text-gray-600">
          {filteredEventsCount} event{filteredEventsCount !== 1 ? 's' : ''} found
        </div>
      </div>
      
      <div className="w-full">
        <AdvancedFilters
          onFilterChange={handleAdvancedFilterChange}
          initialFilters={{
            eventTypes: selectedEventTypes,
            venues: selectedVenues,
            eventVibes: selectedVibes,
            date: dateRange?.from,
            dateFilter: selectedDateFilter
          }}
          eventCategories={allEventTypes}
          className="w-full"
        />
      </div>
    </div>
  );
};
