
import React, { useState } from 'react';
import { EventsAdvancedFilters } from '@/components/events/page-components/EventsAdvancedFilters';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, ChevronDown, ChevronUp, MapPin, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Event } from '@/types';
import { LocationCategory } from '@/utils/locationCategories';

interface EventsAdvancedSectionProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  selectedVibes: string[];
  selectedLocation: string | null;
  dateRange: any;
  selectedDateFilter: string;
  filteredEventsCount: number;
  allEventTypes: string[];
  availableVenues: Array<{ id: string; name: string; city: string }>;
  events?: Event[];
  venueAreas?: LocationCategory[];
  isLocationLoaded?: boolean;
  areasLoading?: boolean;
}

export const EventsAdvancedSection: React.FC<EventsAdvancedSectionProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  selectedVibes,
  selectedLocation,
  dateRange,
  selectedDateFilter,
  filteredEventsCount,
  allEventTypes,
  availableVenues,
  events = [],
  venueAreas = [],
  isLocationLoaded = true,
  areasLoading = false
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

  // Count events per area
  const getEventCountForArea = (areaId: string): number => {
    if (!events || events.length === 0) return 0;
    
    const area = venueAreas.find(a => a.id === areaId);
    if (!area) return 0;
    
    return events.filter(event => {
      const eventCity = event.venues?.city || event.location;
      if (!eventCity) return false;
      
      return area.cities.some(city => 
        city.toLowerCase() === eventCity.toLowerCase()
      );
    }).length;
  };

  const totalEvents = events?.length || 0;
  const selectedArea = venueAreas.find(a => a.id === selectedLocation);

  const hasActiveAdvancedFilters = selectedEventTypes.length > 0 || 
                                   selectedVenues.length > 0 || 
                                   !!dateRange || 
                                   selectedDateFilter !== 'anytime';

  const hasActiveLocationFilter = selectedLocation !== null;

  // Don't render if no filterable content
  if (eventTypesWithEvents.length === 0 && venuesWithEvents.length === 0 && venueAreas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Filter Row - Location Selector and Advanced Filters Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Location Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Select
              value={selectedLocation || 'all'}
              onValueChange={(value) => onFilterChange({ location: value === 'all' ? null : value })}
              disabled={areasLoading || !isLocationLoaded}
            >
              <SelectTrigger className={`${isMobile ? 'w-40' : 'w-48'} bg-white border-gray-200`}>
                <SelectValue placeholder="Select area..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="all" className="hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span>All Areas</span>
                    <span className="text-xs text-gray-500 ml-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {totalEvents}
                    </span>
                  </div>
                </SelectItem>
                {venueAreas.map(area => {
                  const eventCount = getEventCountForArea(area.id);
                  return (
                    <SelectItem key={area.id} value={area.id} className="hover:bg-gray-50">
                      <div className="flex items-center justify-between w-full">
                        <span>{area.displayName}</span>
                        <span className="text-xs text-gray-500 ml-2 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {eventCount}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters Toggle */}
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
            {(hasActiveAdvancedFilters || hasActiveLocationFilter) && (
              <span className="ml-1 bg-white text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {[
                  selectedEventTypes.length > 0 ? selectedEventTypes.length : 0,
                  selectedVenues.length > 0 ? selectedVenues.length : 0,
                  (dateRange || selectedDateFilter !== 'anytime') ? 1 : 0,
                  hasActiveLocationFilter ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </Button>
        </div>
        
        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-neutral-50`}>
          {filteredEventsCount} events found
        </div>
      </div>

      {/* Location Filter Status */}
      {selectedArea && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Showing events in {selectedArea.displayName}</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {getEventCountForArea(selectedArea.id)} events
          </span>
        </div>
      )}

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
