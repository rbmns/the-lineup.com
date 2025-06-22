
import React, { useState } from 'react';
import { EventsAdvancedFilters } from '@/components/events/page-components/EventsAdvancedFilters';
import { Button } from '@/components/ui/button';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Event } from '@/types';

interface EventsAdvancedSectionProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  selectedVibes: string[];
  dateRange: any;
  selectedDateFilter: string;
  filteredEventsCount: number;
  allEventTypes: string[];
  availableVenues: Array<{ id: string; name: string; city: string }>;
  events?: Event[];
}

export const EventsAdvancedSection: React.FC<EventsAdvancedSectionProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  selectedVibes,
  dateRange,
  selectedDateFilter,
  filteredEventsCount,
  allEventTypes,
  availableVenues,
  events = []
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const isMobile = useIsMobile();

  // Filter event types to only show those that have events
  const eventTypesWithEvents = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const eventTypesSet = new Set<string>();
    events.forEach(event => {
      if (event.event_category) {
        eventTypesSet.add(event.event_category);
      }
    });
    
    return Array.from(eventTypesSet).sort();
  }, [events]);

  // Filter venues to only show those that have events
  const venuesWithEvents = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const venueIdsSet = new Set<string>();
    events.forEach(event => {
      if (event.venue_id) {
        venueIdsSet.add(event.venue_id);
      }
    });
    
    return availableVenues.filter(venue => venueIdsSet.has(venue.id));
  }, [events, availableVenues]);

  const hasActiveAdvancedFilters = selectedEventTypes.length > 0 || 
                                   selectedVenues.length > 0 || 
                                   !!dateRange || 
                                   selectedDateFilter !== 'anytime';

  // Don't render if no filterable content
  if (eventTypesWithEvents.length === 0 && venuesWithEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={showAdvancedFilters ? "default" : "outline"}
            size={isMobile ? "sm" : "default"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
            {showAdvancedFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {hasActiveAdvancedFilters && (
              <span className="ml-1 bg-white text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {[
                  selectedEventTypes.length > 0 ? selectedEventTypes.length : 0,
                  selectedVenues.length > 0 ? selectedVenues.length : 0,
                  (dateRange || selectedDateFilter !== 'anytime') ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </Button>
        </div>
        
        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-neutral-50`}>
          {filteredEventsCount} events found
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <EventsAdvancedFilters
            onFilterChange={onFilterChange}
            selectedEventTypes={selectedEventTypes}
            selectedVenues={selectedVenues}
            dateRange={dateRange}
            selectedDateFilter={selectedDateFilter}
            eventTypes={eventTypesWithEvents}
            venues={venuesWithEvents}
          />
        </div>
      )}
    </div>
  );
};
