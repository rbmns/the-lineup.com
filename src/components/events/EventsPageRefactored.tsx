
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { EventFilterBar } from '@/components/events/filters/EventFilterBar';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { AdvancedFiltersButton } from '@/components/events/AdvancedFiltersButton';
import { AdvancedFiltersPanel } from '@/components/events/filters/AdvancedFiltersPanel';
import { filterEventsByVenue } from '@/utils/eventUtils';
import { filterEventsByDate } from '@/utils/date-filtering';
import { supabase } from '@/lib/supabase';
import { ChevronDown, Filter } from 'lucide-react';

const EventsPageRefactored = () => {
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const [venues, setVenues] = useState<Array<{ value: string, label: string }>>([]);
  const [locations, setLocations] = useState<Array<{ value: string, label: string }>>([]);
  const [isVenuesLoading, setIsVenuesLoading] = useState(true);
  const [eventsFound, setEventsFound] = useState(0);
  
  // Event filter state management
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    showAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter
  } = useEventFilterState();
  
  // Get all unique event types from events
  const allEventTypes = React.useMemo(() => {
    const types = events.map(event => event.event_type).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
  // Fetch all venues for the filter
  useEffect(() => {
    const fetchVenues = async () => {
      setIsVenuesLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          const venueOptions = data.map(venue => ({
            value: venue.id,
            label: venue.name
          }));
          setVenues(venueOptions);
        }
        
        // Create sample locations for the design
        setLocations([
          { value: 'den-haag', label: 'Den Haag' },
          { value: 'amsterdam', label: 'Amsterdam' },
          { value: 'rotterdam', label: 'Rotterdam' }
        ]);
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setIsVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);
  
  // Filter events by selected event types - all selected by default
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset
  } = useCategoryFilterSelection(allEventTypes);
  
  // Keep the category filter and event type filter in sync
  useEffect(() => {
    setSelectedEventTypes(selectedCategories);
  }, [selectedCategories, setSelectedEventTypes]);
  
  // Filter events based on all filters
  const filteredEvents = React.useMemo(() => {
    // Show all events by default, even if no categories are selected
    if (selectedCategories.length === 0 && allEventTypes.length > 0) {
      // Return all events if no event types are selected
      let filtered = events;
      
      // Apply venue filter if selected
      if (selectedVenues.length > 0) {
        filtered = filterEventsByVenue(filtered, selectedVenues);
      }
      
      // Apply date filter if selected
      if (dateRange || selectedDateFilter) {
        filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
      }
      
      return filtered;
    }
    
    // Apply event type filter if some event types are selected
    let filtered = events;
    if (selectedCategories.length > 0 && selectedCategories.length !== allEventTypes.length) {
      filtered = events.filter(event => 
        event.event_type && selectedCategories.includes(event.event_type)
      );
    }
    
    // Apply venue filter
    if (selectedVenues.length > 0) {
      filtered = filterEventsByVenue(filtered, selectedVenues);
    }
    
    // Apply date filter
    if (dateRange || selectedDateFilter) {
      filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
    }
    
    return filtered;
  }, [events, selectedCategories, allEventTypes.length, selectedVenues, dateRange, selectedDateFilter]);

  // Update events found count
  useEffect(() => {
    setEventsFound(filteredEvents.length);
  }, [filteredEvents]);
  
  const { 
    handleRsvp: enhancedHandleRsvp, 
    loadingEventId
  } = useEnhancedRsvp(user?.id);
  
  return (
    <div className="w-full px-4 md:px-6 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="Upcoming Events" />
        
        {/* Search placeholder - not functional */}
        <div className="relative mb-4 mt-4">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full p-2 pl-8 border border-gray-200 rounded-lg"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
        
        {/* Events category filter bar */}
        <div className="mt-2 mb-4 overflow-x-auto">
          <EventFilterBar
            allEventTypes={allEventTypes}
            selectedEventTypes={selectedCategories}
            onToggleEventType={toggleCategory}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onReset={reset}
            hasActiveFilters={hasActiveFilters}
            onClearAllFilters={resetFilters}
            className="py-2"
          />
        </div>
        
        {/* Advanced Filters Button - collapsible panel style */}
        <div className="mb-4">
          <button 
            onClick={toggleAdvancedFilters}
            className="flex items-center gap-2 py-1.5 px-3 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <AdvancedFiltersPanel
            isOpen={showAdvancedFilters}
            onClose={() => toggleAdvancedFilters()}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={setSelectedDateFilter}
            venues={venues}
            selectedVenues={selectedVenues}
            onVenueChange={setSelectedVenues}
            locations={locations}
            className="mb-6"
          />
        )}
        
        {/* Active Filters Summary */}
        {hasAdvancedFilters && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 items-center">
              {selectedVenues.map(venueId => {
                const venue = venues.find(v => v.value === venueId);
                return venue ? (
                  <div key={venueId} className="bg-purple-100 text-purple-900 rounded-full px-3 py-1 text-xs flex items-center">
                    <span>Venue: {venue.label}</span>
                    <button 
                      className="ml-1 h-4 w-4 p-0" 
                      onClick={() => handleRemoveVenue(venueId)}
                    >
                      &times;
                    </button>
                  </div>
                ) : null;
              })}
              
              {(dateRange || selectedDateFilter) && (
                <div className="bg-purple-100 text-purple-900 rounded-full px-3 py-1 text-xs flex items-center">
                  <span>
                    Date: {selectedDateFilter || (dateRange ? 'Custom range' : '')}
                  </span>
                  <button 
                    className="ml-1 h-4 w-4 p-0" 
                    onClick={handleClearDateFilter}
                  >
                    &times;
                  </button>
                </div>
              )}
              
              {hasAdvancedFilters && (
                <button 
                  className="text-xs text-purple-700 hover:text-purple-900"
                  onClick={resetFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Events count display */}
        <div className="mb-4 text-sm text-gray-600">
          {eventsFound} {eventsFound === 1 ? 'event' : 'events'} found
        </div>
        
        <div className="space-y-8">
          <LazyEventsList 
            mainEvents={filteredEvents}
            relatedEvents={[]} 
            isLoading={eventsLoading || isVenuesLoading || isFilterLoading}
            onRsvp={user ? enhancedHandleRsvp : undefined}
            showRsvpButtons={!!user}
            hasActiveFilters={hasActiveFilters}
            loadingEventId={loadingEventId}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPageRefactored;
