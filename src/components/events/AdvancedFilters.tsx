
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangeFilter } from './DateRangeFilter';
import { EventTypesFilter } from './EventTypesFilter';
import { VenueFilter } from './VenueFilter';
import { cn } from '@/lib/utils';

interface EventTypeOption {
  value: string;
  label: string;
}

interface VenueOption {
  value: string;
  label: string;
}

interface AdvancedFiltersProps {
  eventTypeOptions: EventTypeOption[];
  selectedEventTypes: string[];
  onEventTypeChange: (types: string[]) => void;
  onEventTypeReset: () => void;
  
  venueOptions: VenueOption[];
  selectedVenues: string[];
  onVenueChange: (venues: string[]) => void;
  onVenueReset: () => void;
  
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onDateRangeReset: () => void;
  
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
  
  onResetAll: () => void;
  hasAnyFilter: boolean;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  eventTypeOptions,
  selectedEventTypes,
  onEventTypeChange,
  onEventTypeReset,
  
  venueOptions,
  selectedVenues,
  onVenueChange,
  onVenueReset,
  
  dateRange,
  onDateRangeChange,
  onDateRangeReset,
  
  selectedDateFilter,
  onDateFilterChange,
  
  onResetAll,
  hasAnyFilter
}) => {
  // Get count of selected filters for display
  const eventTypeCount = selectedEventTypes.length;
  const venueCount = selectedVenues.length;
  const hasDateFilter = !!dateRange || !!selectedDateFilter;
  
  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Filter className="mr-2 h-5 w-5" /> 
          Advanced Filters
        </h3>
        {hasAnyFilter && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetAll}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="mr-1 h-4 w-4" /> Reset all
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cn("space-y-2", eventTypeCount > 0 ? "border-purple p-2 rounded-md border-[#9b87f5] border" : "")}>
          <p className="text-sm font-medium">
            Event Type
            {eventTypeCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-[#9b87f5] text-white rounded-full text-xs">
                {eventTypeCount}
              </span>
            )}
          </p>
          <EventTypesFilter
            eventTypes={eventTypeOptions}
            selectedEventTypes={selectedEventTypes}
            onEventTypeChange={onEventTypeChange}
            onReset={onEventTypeReset}
          />
        </div>
        
        <div className={cn("space-y-2", venueCount > 0 ? "border-purple p-2 rounded-md border-[#9b87f5] border" : "")}>
          <p className="text-sm font-medium">
            Venue
            {venueCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-[#9b87f5] text-white rounded-full text-xs">
                {venueCount}
              </span>
            )}
          </p>
          <VenueFilter
            venues={venueOptions}
            selectedVenues={selectedVenues}
            onVenueChange={onVenueChange}
            onReset={onVenueReset}
          />
        </div>
        
        <div className={cn("space-y-2", hasDateFilter ? "border-purple p-2 rounded-md border-[#9b87f5] border" : "")}>
          <p className="text-sm font-medium">Date Range</p>
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            onReset={onDateRangeReset}
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={onDateFilterChange}
          />
        </div>
      </div>
    </div>
  );
};
