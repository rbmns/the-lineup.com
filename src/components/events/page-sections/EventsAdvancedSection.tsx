
import React from 'react';
import AdvancedFilters from '@/components/polymet/advanced-filters';
import { MapPin } from 'lucide-react';

interface EventsAdvancedSectionProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  selectedVibes: string[];
  dateRange: any;
  selectedDateFilter: string;
  filteredEventsCount: number;
  showLocationFilter?: boolean;
  allEventTypes?: string[];
}

export const EventsAdvancedSection: React.FC<EventsAdvancedSectionProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  selectedVibes,
  dateRange,
  selectedDateFilter,
  filteredEventsCount,
  showLocationFilter = false,
  allEventTypes = [],
}) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-medium">Refine your search</h3>
      </div>
      
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <AdvancedFilters
            onFilterChange={(filters) => {
              console.log('Advanced filters changed:', filters);
              // Map the filter structure to what the parent expects
              onFilterChange({
                eventTypes: filters.eventTypes || selectedEventTypes,
                venues: filters.venues || selectedVenues,
                vibes: filters.eventVibes || selectedVibes,
                date: filters.date,
                dateFilter: filters.dateFilter
              });
            }}
            locations={["Zandvoort Area"]}
            initialFilters={{
              location: "Zandvoort Area",
              eventTypes: selectedEventTypes,
              venues: selectedVenues,
              eventVibes: selectedVibes,
              date: dateRange?.from,
              dateFilter: selectedDateFilter
            }}
          />
          
          {showLocationFilter && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              <MapPin className="h-3 w-3" />
              <span className="hidden sm:inline">Zandvoort</span>
              <span className="sm:hidden">Zandvoort</span>
            </div>
          )}
        </div>
        
        <span className="text-sm text-gray-600 whitespace-nowrap md:ml-auto">
          {filteredEventsCount} events found
        </span>
      </div>
    </div>
  );
};
