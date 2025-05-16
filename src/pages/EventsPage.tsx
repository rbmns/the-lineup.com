import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { filterUpcomingEvents } from '@/utils/date-filtering';
import { pageSeoTags } from '@/utils/seoUtils';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { useCanonical } from '@/hooks/useCanonical';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { useRsvpHandler } from '@/hooks/useRsvpHandler';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { EventFilterBar } from '@/components/events/filters/EventFilterBar';
import { AdvancedFiltersButton } from '@/components/events/AdvancedFiltersButton';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { DateRange } from 'react-day-picker';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { filterEventsByDate, filterEventsByVenue } from '@/utils/eventUtils';
import { EventsTeaser } from '@/components/events/EventsTeaser';

const EventsPage = () => {
  // Add canonical URL for SEO - providing the path as required parameter
  useCanonical('/events', pageSeoTags.events.title);
  
  const { user } = useAuth();
  const { data: events = [], isLoading } = useEvents(user?.id);
  const { handleRsvp, loadingEventId } = useEnhancedRsvp(user?.id);
  const rsvpInProgressRef = useRef(false);
  
  // State for showing advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
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
    resetFilters,
    hasActiveFilters
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
  
  // Use the optimized RSVP handler with proper event handling
  const { handleEventRsvp } = useRsvpHandler(user, handleRsvp, rsvpInProgressRef);
  
  // Set page metadata
  useEffect(() => {
    document.title = pageSeoTags.events.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.events.description);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageSeoTags.events.title);
    if (ogDesc) ogDesc.setAttribute('content', pageSeoTags.events.description);
  }, []);

  // Determine if we have no categories selected
  const noCategoriesSelected = selectedCategories.length === 0;
  
  // Filter events based on all filters
  const filteredEvents = React.useMemo(() => {
    // Start with upcoming events
    let filtered = filterUpcomingEvents(events || []);
    
    // If no categories are selected, return empty array (no events)
    if (noCategoriesSelected) {
      return [];
    }
    
    // Apply event type filter only if not all categories are selected
    if (selectedCategories.length !== allEventTypes.length) {
      filtered = filtered.filter(event => 
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

  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="What's Happening?" />
        
        {/* Filter section with fixed height */}
        <div className="mt-6 mb-8 relative">
          <div className="flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex-grow overflow-x-auto pb-2">
                <EventFilterBar
                  allEventTypes={allEventTypes}
                  selectedEventTypes={selectedCategories}
                  onToggleEventType={toggleCategory}
                  onSelectAll={selectAll}
                  onDeselectAll={deselectAll}
                  onReset={reset}
                  className="min-h-[44px]"
                />
              </div>
              
              <div className="ml-4 mt-1 flex-shrink-0">
                <AdvancedFiltersButton
                  hasActiveFilters={selectedVenues.length > 0 || !!dateRange || !!selectedDateFilter}
                  isOpen={showAdvancedFilters}
                  onOpen={setShowAdvancedFilters}
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Date Range</h3>
                      <DateRangeFilter
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        onReset={() => setDateRange(undefined)}
                        selectedDateFilter={selectedDateFilter}
                        onDateFilterChange={setSelectedDateFilter}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Venue</h3>
                      <VenueFilter
                        venues={[]} // This would need venue data
                        selectedVenues={selectedVenues}
                        onVenueChange={setSelectedVenues}
                        onReset={() => setSelectedVenues([])}
                      />
                    </div>
                  </div>
                </AdvancedFiltersButton>
              </div>
            </div>
          </div>
        </div>
        
        {/* Events List Section */}
        <div className="space-y-8">
          <LazyEventsList 
            mainEvents={filteredEvents}
            relatedEvents={[]}
            isLoading={isLoading}
            onRsvp={user ? handleEventRsvp : undefined}
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

export default EventsPage;
