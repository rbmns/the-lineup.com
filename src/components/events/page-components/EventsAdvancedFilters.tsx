
import React, { useState } from 'react';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { EventCategoryFilters } from '@/components/events/filters/EventCategoryFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [isVenuesOpen, setIsVenuesOpen] = useState(false);

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
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-primary font-display`}>Categories</h3>
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

      {/* Date Range */}
      <div className="space-y-3">
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-primary font-display`}>Date</h3>
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          selectedDateFilter={selectedDateFilter}
          onDateFilterChange={handleDateFilterChange}
          onReset={() => onFilterChange({ date: undefined, dateFilter: 'anytime' })}
        />
      </div>

      {/* Venues - Collapsible */}
      {venues.length > 0 && (
        <div className="space-y-3">
          <Collapsible open={isVenuesOpen} onOpenChange={setIsVenuesOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto hover:bg-transparent font-display"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-primary`}>
                    Venues
                    {selectedVenues.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-kelp text-driftwood rounded-full text-xs font-mono">
                        {selectedVenues.length}
                      </span>
                    )}
                  </h3>
                </div>
                {isVenuesOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              <VenueFilter
                venues={venueOptions}
                selectedVenues={selectedVenues}
                onVenueChange={handleVenueChange}
                onReset={() => onFilterChange({ venues: [] })}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
};
