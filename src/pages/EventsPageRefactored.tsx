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
import { useSimilarEventsHandler } from '@/hooks/events/useSimilarEventsHandler';

const EventsPageRefactored = () => {
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const [venues, setVenues] = useState<Array<{ value: string, label: string }>>([]);
  const [locations, setLocations] = useState<Array<{ value: string, label: string }>>([]);
  const [isVenuesLoading, setIsVenuesLoading] = useState(true);
  
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
  
  const allEventTypes = React.useMemo(() => {
    const types = events.map(event => event.event_type).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
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
        
        // Create sample locations for the design (now just fixed to "Zandvoort Area")
        setLocations([
          { value: 'zandvoort-area', label: 'Zandvoort Area' }
        ]);
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setIsVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);
  
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected
  } = useCategoryFilterSelection(allEventTypes);
  
  useEffect(() => {
    setSelectedEventTypes(selectedCategories);
  }, [selectedCategories, setSelectedEventTypes]);
  
  const filteredEvents = React.useMemo(() => {
    if (selectedCategories.length === 0) {
      return [];
    }
    
    if (selectedCategories.length === allEventTypes.length) {
      let filtered = events;
      
      if (selectedVenues.length > 0) {
        filtered = filterEventsByVenue(filtered, selectedVenues);
      }
      
      if (dateRange || selectedDateFilter) {
        filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
      }
      
      return filtered;
    }
    
    let filtered = events.filter(event => 
      event.event_type && selectedCategories.includes(event.event_type)
    );
    
    if (selectedVenues.length > 0) {
      filtered = filterEventsByVenue(filtered, selectedVenues);
    }
    
    if (dateRange || selectedDateFilter) {
      filtered = filterEventsByDate(filtered, selectedDateFilter, dateRange);
    }
    
    return filtered;
  }, [events, selectedCategories, allEventTypes.length, selectedVenues, dateRange, selectedDateFilter]);
  
  const { similarEvents } = useSimilarEventsHandler({
    mainEvents: filteredEvents,
    hasActiveFilters,
    selectedEventTypes: selectedCategories,
    dateRange,
    selectedDateFilter,
    userId: user?.id
  });

  const eventsCount = filteredEvents.length;
  
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
            hasActiveFilters={hasActiveFilters}
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
        <EventCountDisplay count={eventsCount} />
        
        <div className="space-y-8">
          {/* Show NoResultsFound when there are no event types selected */}
          {isNoneSelected ? (
            <NoResultsFound 
              resetFilters={selectAll}
              message="No event types selected. Select at least one event type to see events."
            />
          ) : (
            <LazyEventsList 
              mainEvents={filteredEvents}
              relatedEvents={similarEvents} 
              isLoading={eventsLoading || isVenuesLoading || isFilterLoading}
              onRsvp={user ? enhancedHandleRsvp : undefined}
              showRsvpButtons={!!user}
              hasActiveFilters={hasActiveFilters}
              loadingEventId={loadingEventId}
              hideCount={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPageRefactored;
