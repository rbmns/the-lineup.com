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
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { filterEventsByVenue } from '@/utils/eventUtils';
import { filterEventsByDate } from '@/utils/date-filtering';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';

const EventsPageRefactored = () => {
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const [venues, setVenues] = useState<Array<{ value: string, label: string }>>([]);
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
        
        {/* Add the filter bar */}
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
        
        {/* Toggle for Advanced Filters - Now aligned left */}
        <div className="flex justify-start mb-4">
          <Button
            variant="outline"
            onClick={toggleAdvancedFilters}
            className="flex items-center gap-2 text-sm"
            size="sm"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            {showAdvancedFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Advanced Filters Panel - Matching the exact design */}
        {showAdvancedFilters && (
          <div className="mb-6 border rounded-md p-4 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Date Range</h4>
                <DateRangeFilter
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  onReset={() => setDateRange(undefined)}
                  selectedDateFilter={selectedDateFilter}
                  onDateFilterChange={setSelectedDateFilter}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Venue</h4>
                <Select 
                  value={selectedVenues[0] || ""} 
                  onValueChange={handleVenueSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.value} value={venue.value}>
                        {venue.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
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
          />
        </div>
      </div>
    </div>
  );

  // Helper function for handling venue selection
  function handleVenueSelect(venueId: string) {
    // Toggle the venue selection
    if (selectedVenues.includes(venueId)) {
      setSelectedVenues(selectedVenues.filter(v => v !== venueId));
    } else {
      setSelectedVenues([...selectedVenues, venueId]);
    }
  }
};

export default EventsPageRefactored;
