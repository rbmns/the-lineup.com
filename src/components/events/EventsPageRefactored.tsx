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

const EventsPageRefactored = () => {
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const [venues, setVenues] = useState<Array<{ value: string, label: string }>>([]);
  const [locations, setLocations] = useState<Array<{ value: string, label: string }>>([]);
  const [isVenuesLoading, setIsVenuesLoading] = useState(true);
  
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
  
  const { 
    handleRsvp: enhancedHandleRsvp, 
    loadingEventId
  } = useEnhancedRsvp(user?.id);
  
  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="What's Happening?" />
        
        {/* Events category filter bar */}
        <div className="mt-6 mb-4">
          <EventFilterBar
            allEventTypes={allEventTypes}
            selectedEventTypes={selectedCategories}
            onToggleEventType={toggleCategory}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onReset={reset}
            hasActiveFilters={hasActiveFilters}
            onClearAllFilters={resetFilters}
            className="bg-white rounded-lg shadow-sm p-4"
          />
        </div>
        
        {/* Advanced Filters Button - Fixed by adding children */}
        <div className="flex justify-start mb-4">
          <AdvancedFiltersButton
            hasActiveFilters={hasAdvancedFilters}
            isOpen={showAdvancedFilters}
            onOpen={toggleAdvancedFilters}
            variant="dropdown"
          >
            {/* This empty fragment serves as the children prop */}
            <></>
          </AdvancedFiltersButton>
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
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {selectedVenues.map(venueId => {
                const venue = venues.find(v => v.value === venueId);
                return venue ? (
                  <div key={venueId} className="bg-[#9b87f5] text-white rounded-full px-3 py-1 text-xs flex items-center">
                    <span>Venue: {venue.label}</span>
                    <button 
                      className="ml-1 h-4 w-4 p-0 text-white hover:text-white hover:bg-transparent" 
                      onClick={() => handleRemoveVenue(venueId)}
                    >
                      &times;
                    </button>
                  </div>
                ) : null;
              })}
              
              {(dateRange || selectedDateFilter) && (
                <div className="bg-[#9b87f5] text-white rounded-full px-3 py-1 text-xs flex items-center">
                  <span>
                    Date: {selectedDateFilter || (dateRange ? 'Custom range' : '')}
                  </span>
                  <button 
                    className="ml-1 h-4 w-4 p-0 text-white hover:text-white hover:bg-transparent" 
                    onClick={handleClearDateFilter}
                  >
                    &times;
                  </button>
                </div>
              )}
              
              {hasAdvancedFilters && (
                <button 
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={resetFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-8 mt-8">
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
