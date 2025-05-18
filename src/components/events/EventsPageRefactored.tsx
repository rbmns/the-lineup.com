
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
import { AdvancedFiltersPanel } from '@/components/events/filters/AdvancedFiltersPanel';
import { filterEventsByVenue } from '@/utils/eventUtils';
import { filterEventsByDate } from '@/utils/date-filtering';
import { supabase } from '@/lib/supabase';
import { EventSearch } from '@/components/events/search/EventSearch';
import { AdvancedFiltersToggle } from '@/components/events/filters/AdvancedFiltersToggle';
import { ActiveFiltersSummary } from '@/components/events/filters/ActiveFiltersSummary';
import { EventCountDisplay } from '@/components/events/EventCountDisplay';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';

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
    // If no categories selected, show no events
    if (selectedCategories.length === 0) {
      return [];
    }
    
    // Show all events if all categories are selected
    if (selectedCategories.length === allEventTypes.length) {
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
    let filtered = events.filter(event => 
      event.event_type && selectedCategories.includes(event.event_type)
    );
    
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
        
        {/* Search input */}
        <EventSearch className="mb-4 mt-4" />
        
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
        
        {/* Advanced Filters Toggle */}
        <div className="mb-4">
          <AdvancedFiltersToggle 
            showAdvancedFilters={showAdvancedFilters}
            toggleAdvancedFilters={toggleAdvancedFilters}
          />
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
        <ActiveFiltersSummary 
          selectedVenues={selectedVenues}
          venues={venues}
          dateRange={dateRange}
          selectedDateFilter={selectedDateFilter}
          hasAdvancedFilters={hasAdvancedFilters}
          handleRemoveVenue={handleRemoveVenue}
          handleClearDateFilter={handleClearDateFilter}
          resetFilters={resetFilters}
        />
        
        {/* Events count display */}
        <EventCountDisplay count={eventsFound} />
        
        <div className="space-y-8">
          {/* Show NoResultsFound when there are no event types selected */}
          {selectedCategories.length === 0 ? (
            <NoResultsFound 
              resetFilters={reset}
              message="No event types selected. Select at least one event type to see events."
            />
          ) : (
            <LazyEventsList 
              mainEvents={filteredEvents}
              relatedEvents={[]} 
              isLoading={eventsLoading || isVenuesLoading || isFilterLoading}
              onRsvp={user ? enhancedHandleRsvp : undefined}
              showRsvpButtons={!!user}
              hasActiveFilters={hasActiveFilters}
              loadingEventId={loadingEventId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPageRefactored;
