
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { filterEventsByDate, filterEventsByDateRange } from '@/utils/dateUtils';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useCanonical } from '@/hooks/useCanonical';
import { pageSeoTags } from '@/utils/seoUtils';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { EventFilterSection } from '@/components/events/filters/EventFilterSection';
import { FilterSummary } from '@/components/events/FilterSummary';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { toast } from '@/hooks/use-toast';

const CategoryFilteredEventsPage = () => {
  // Apply meta tags
  useEffect(() => {
    document.title = pageSeoTags.events.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.events.description);
  }, []);
  
  // Add canonical URL for SEO
  useCanonical('/events', pageSeoTags.events.title);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: events = [], isLoading, error, refetch } = useEvents(user?.id);
  const { savePosition, restorePosition } = useScrollPosition();
  
  // Event type filter state
  const [showEventTypeFilter, setShowEventTypeFilter] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  
  // Venue filter state
  const [showVenueFilter, setShowVenueFilter] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  
  // Date filter state
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState<any>(undefined);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  
  // Loading state for filters
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  
  // RSVP loading state
  const [rsvpLoading, setRsvpLoading] = useState(false);
  
  // Available filter options
  const [availableEventTypes, setAvailableEventTypes] = useState<Array<{value: string, label: string}>>([]);
  const [availableVenues, setAvailableVenues] = useState<Array<{value: string, label: string}>>([]);
  
  // State for handling "no exact matches" message
  const [showNoExactMatchesMessage, setShowNoExactMatchesMessage] = useState(false);
  
  // State for storing exact matches and similar events
  const [exactMatches, setExactMatches] = useState<any[]>([]);
  const [similarEvents, setSimilarEvents] = useState<any[]>([]);
  
  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    return (
      selectedEventTypes.length > 0 ||
      selectedVenues.length > 0 ||
      dateRange !== undefined ||
      selectedDateFilter !== ''
    );
  }, [selectedEventTypes, selectedVenues, dateRange, selectedDateFilter]);
  
  // Extract available event types and venues from events
  useEffect(() => {
    if (events && events.length > 0) {
      // Extract unique event types
      const uniqueEventTypes = [...new Set(events.map(event => event.event_type).filter(Boolean))]
        .map(type => ({ value: type, label: type }));
      setAvailableEventTypes(uniqueEventTypes);
      
      // Extract unique venues
      const uniqueVenues = [...new Set(events.map(event => event.venues?.name).filter(Boolean))]
        .map(venueName => ({ value: venueName, label: venueName }));
      setAvailableVenues(uniqueVenues);
    }
  }, [events]);
  
  // Filter events based on selected filters
  useEffect(() => {
    setIsFilterLoading(true);
    setShowNoExactMatchesMessage(false);
    
    // Save scroll position before filtering
    const scrollPosition = savePosition();
    
    // Apply filters
    const filteredEvents = events.filter(event => {
      // Event type filter
      if (selectedEventTypes.length > 0 && !selectedEventTypes.includes(event.event_type)) {
        return false;
      }
      
      // Venue filter
      if (selectedVenues.length > 0 && !selectedVenues.includes(event.venues?.name)) {
        return false;
      }
      
      // Date filter
      if (selectedDateFilter || dateRange) {
        const isInRange = filterEventsByDateRange(event, selectedDateFilter, dateRange);
        if (!isInRange) {
          return false;
        }
      }
      
      return true;
    });
    
    // Update state with filtered events
    setExactMatches(filteredEvents);
    setSimilarEvents([]);
    
    // Show "no exact matches" message if no events are found
    setShowNoExactMatchesMessage(filteredEvents.length === 0);
    
    // Restore scroll position after filtering
    restorePosition(scrollPosition);
    
    // Simulate loading delay for UI effect
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);
  }, [events, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, savePosition, restorePosition]);
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
    toast({
      title: "All filters reset"
    });
  };
  
  const selectAllEventTypes = useCallback(() => {
    setSelectedEventTypes(availableEventTypes.map(et => et.value));
    toast({
      title: "All categories selected"
    });
  }, [availableEventTypes, setSelectedEventTypes]);
  
  const deselectAllEventTypes = useCallback(() => {
    setSelectedEventTypes([]);
    toast({
      title: "All categories deselected"
    });
  }, [setSelectedEventTypes]);

  const handleRemoveEventType = (type: string) => {
    setSelectedEventTypes(prev => prev.filter(t => t !== type));
    toast({
      title: `Removed filter: ${type}`
    });
  };
  
  const handleRemoveVenue = (venue: string) => {
    setSelectedVenues(prev => prev.filter(v => v !== venue));
    toast({
      title: "Removed venue filter"
    });
  };
  
  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
    toast({
      title: "Date filter cleared"
    });
  };
  
  // RSVP handler function
  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user) {
      console.log("User not logged in");
      return false;
    }
    
    try {
      console.log(`EventsPage - RSVP handler called for event: ${eventId}, status: ${status}`);
      setRsvpLoading(true);
      
      // Simulate RSVP action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`EventsPage - RSVP completed for event: ${eventId}, status: ${status}`);
      toast({
        title: `RSVP updated to ${status}`
      });
      
      // Refetch events to update the list
      await refetch();
      
      return true;
    } catch (error) {
      console.error("Error in EventsPage RSVP handler:", error);
      toast({
        title: "Failed to update RSVP status",
        variant: "destructive"
      });
      return false;
    } finally {
      setRsvpLoading(false);
    }
  };
  
  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="Explore Events" />
        
        <div className="space-y-12">
          <EventFilterSection
            showEventTypeFilter={showEventTypeFilter}
            setShowEventTypeFilter={setShowEventTypeFilter}
            showVenueFilter={showVenueFilter}
            setShowVenueFilter={setShowVenueFilter}
            showDateFilter={showDateFilter}
            setShowDateFilter={setShowDateFilter}
            selectedEventTypes={selectedEventTypes}
            setSelectedEventTypes={setSelectedEventTypes}
            selectedVenues={selectedVenues}
            setSelectedVenues={setSelectedVenues}
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedDateFilter={selectedDateFilter}
            setSelectedDateFilter={setSelectedDateFilter}
            availableEventTypes={availableEventTypes}
            availableVenues={availableVenues}
            resetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
          
          <FilterSummary 
            selectedEventTypes={selectedEventTypes}
            selectedVenues={selectedVenues}
            dateRange={dateRange}
            selectedDateFilter={selectedDateFilter}
            eventTypeOptions={availableEventTypes}
            venueOptions={availableVenues}
            onRemoveEventType={handleRemoveEventType}
            onRemoveVenue={handleRemoveVenue}
            onClearDateFilter={handleClearDateFilter}
          />

          {/* No Exact Matches Message */}
          {showNoExactMatchesMessage && (
            <NoResultsFound resetFilters={resetFilters} />
          )}

          {/* Events List Section */}
          <LazyEventsList 
            mainEvents={exactMatches}
            relatedEvents={similarEvents}
            isLoading={isLoading || isFilterLoading}
            isRsvpLoading={rsvpLoading}
            onRsvp={user ? handleEventRsvp : undefined}
            showRsvpButtons={!!user}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryFilteredEventsPage;
