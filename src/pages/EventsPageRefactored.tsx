import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { EventFilterBar } from '@/components/events/filters/EventFilterBar';
import { useCategoryFilterSelection } from '@/hooks/useCategoryFilterSelection';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { AdvancedFiltersButton } from '@/components/events/filters/AdvancedFiltersButton';
import { AdvancedFiltersPanel } from '@/components/events/filters/AdvancedFiltersPanel';
import { Button } from '@/components/ui/button';
import { filterEventsByVenue } from '@/utils/eventUtils';
import { filterEventsByDate } from '@/utils/eventUtils';
import { supabase } from '@/lib/supabase';
import { EventsTeaser } from '@/components/events/EventsTeaser';

const EventsPageRefactored = () => {
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const [venues, setVenues] = useState<Array<{ value: string, label: string }>>([]);
  const [isVenuesLoading, setIsVenuesLoading] = useState(true);
  
  // Get all unique event types from events
  const allEventTypes = React.useMemo(() => {
    const types = events.map(event => event.event_type).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
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
    setShowAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter
  } = useEventFilterState();
  
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
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setIsVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);
  
  // Determine if we have no categories selected
  const noCategoriesSelected = selectedCategories.length === 0;
  
  // Filter events based on all filters
  const filteredEvents = React.useMemo(() => {
    // Start with all events
    let filtered = events;
    
    // If no categories are selected, return empty array (no events)
    if (noCategoriesSelected) {
      return [];
    }
    
    // Apply event type filter only if not all categories are selected
    if (selectedCategories.length !== allEventTypes.length) {
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
  }, [events, selectedCategories, allEventTypes.length, selectedVenues, dateRange, selectedDateFilter, noCategoriesSelected]);
  
  const { 
    handleRsvp: enhancedHandleRsvp, 
    loadingEventId
  } = useEnhancedRsvp(user?.id);
  
  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="What's Happening?" />
        
        <div className="mt-6 mb-2 flex flex-wrap justify-between items-center gap-4">
          {/* Category Pills in fixed height container */}
          <EventFilterBar
            allEventTypes={allEventTypes}
            selectedEventTypes={selectedCategories}
            onToggleEventType={toggleCategory}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onReset={reset}
            className="flex-grow"
          />
          
          {/* Advanced Filters Button */}
          <div className="flex-shrink-0">
            <AdvancedFiltersButton
              hasActiveFilters={hasAdvancedFilters}
              isOpen={showAdvancedFilters}
              onOpen={setShowAdvancedFilters}
              className="ml-auto"
            >
              <AdvancedFiltersPanel
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                selectedDateFilter={selectedDateFilter}
                onDateFilterChange={setSelectedDateFilter}
                venues={venues}
                selectedVenues={selectedVenues}
                onVenueChange={setSelectedVenues}
              />
            </AdvancedFiltersButton>
          </div>
        </div>
        
        {/* Active Filters Summary */}
        {hasAdvancedFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 items-center mt-4">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {selectedVenues.map(venueId => {
                const venue = venues.find(v => v.value === venueId);
                return venue ? (
                  <div key={venueId} className="bg-[#9b87f5] text-white rounded-full px-3 py-1 text-xs flex items-center">
                    <span>Venue: {venue.label}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-1 h-4 w-4 p-0 text-white hover:text-white hover:bg-transparent" 
                      onClick={() => handleRemoveVenue(venueId)}
                    >
                      &times;
                    </Button>
                  </div>
                ) : null;
              })}
              
              {(dateRange || selectedDateFilter) && (
                <div className="bg-[#9b87f5] text-white rounded-full px-3 py-1 text-xs flex items-center">
                  <span>
                    Date: {selectedDateFilter || (dateRange ? 'Custom range' : '')}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-1 h-4 w-4 p-0 text-white hover:text-white hover:bg-transparent" 
                    onClick={handleClearDateFilter}
                  >
                    &times;
                  </Button>
                </div>
              )}
              
              {hasAdvancedFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500"
                  onClick={resetFilters}
                >
                  Clear all filters
                </Button>
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
            noCategoriesSelected={noCategoriesSelected}
            renderTeaserAfterRow={!user && 2}
            teaser={<EventsTeaser />}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPageRefactored;
