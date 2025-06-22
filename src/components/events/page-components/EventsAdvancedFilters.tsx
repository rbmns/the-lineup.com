
import React from 'react';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { EventCategoryFilters } from '@/components/events/filters/EventCategoryFilters';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventsAdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  dateRange: any;
  selectedDateFilter: string;
  eventTypes: string[];
  venues: Array<{ id: string; name: string; city: string }>;
}

export const EventsAdvancedFilters: React.FC<EventsAdvancedFiltersProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  dateRange,
  selectedDateFilter,
  eventTypes,
  venues
}) => {
  const isMobile = useIsMobile();

  const handleEventTypeToggle = (eventType: string) => {
    const newSelectedTypes = selectedEventTypes.includes(eventType)
      ? selectedEventTypes.filter(type => type !== eventType)
      : [...selectedEventTypes, eventType];
    
    onFilterChange({ eventTypes: newSelectedTypes });
  };

  const handleSelectAllEventTypes = () => {
    onFilterChange({ eventTypes: eventTypes });
  };

  const handleDeselectAllEventTypes = () => {
    onFilterChange({ eventTypes: [] });
  };

  const handleVenueChange = (venues: string[]) => {
    onFilterChange({ venues });
  };

  const handleDateRangeChange = (range: any) => {
    onFilterChange({ date: range, dateFilter: 'anytime' });
  };

  const handleDateFilterChange = (filter: string) => {
    onFilterChange({ dateFilter: filter, date: undefined });
  };

  // Convert venues to the format expected by VenueFilter
  const venueOptions = venues.map(venue => ({
    value: venue.id,
    label: `${venue.name} (${venue.city})`
  }));

  return (
    <div className={`space-y-6 ${isMobile ? 'space-y-4' : ''}`}>
      {/* Event Categories */}
      {eventTypes.length > 0 && (
        <div className="space-y-3">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-primary`}>Categories</h3>
          <EventCategoryFilters
            allEventTypes={eventTypes}
            selectedEventTypes={selectedEventTypes}
            onToggleEventType={handleEventTypeToggle}
            onSelectAll={handleSelectAllEventTypes}
            onDeselectAll={handleDeselectAllEventTypes}
            onReset={() => onFilterChange({ eventTypes: [] })}
          />
        </div>
      )}

      {/* Venues */}
      {venues.length > 0 && (
        <div className="space-y-3">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-primary`}>Venues</h3>
          <VenueFilter
            venues={venueOptions}
            selectedVenues={selectedVenues}
            onVenueChange={handleVenueChange}
            onReset={() => onFilterChange({ venues: [] })}
          />
        </div>
      )}

      {/* Date Range */}
      <div className="space-y-3">
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-primary`}>Date</h3>
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          selectedDateFilter={selectedDateFilter}
          onDateFilterChange={handleDateFilterChange}
          onReset={() => onFilterChange({ date: undefined, dateFilter: 'anytime' })}
        />
      </div>
    </div>
  );
};
