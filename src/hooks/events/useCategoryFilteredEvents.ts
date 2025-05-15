
import { useState, useEffect } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { filterEventsByDateRange } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast';

export const useCategoryFilteredEvents = (userId: string | undefined) => {
  const { data: events = [], isLoading, error, refetch } = useEvents(userId);
  
  // Event type filter state
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  
  // Venue filter state
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  
  // Date filter state
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
  const hasActiveFilters = selectedEventTypes.length > 0 || 
                          selectedVenues.length > 0 || 
                          dateRange !== undefined || 
                          selectedDateFilter !== '';
  
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
    
    // Simulate loading delay for UI effect
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);
  }, [events, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter]);
  
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

  // Filter action handlers
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

  const selectAllEventTypes = () => {
    setSelectedEventTypes(availableEventTypes.map(et => et.value));
    toast({
      title: "All categories selected"
    });
  };
  
  const deselectAllEventTypes = () => {
    setSelectedEventTypes([]);
    toast({
      title: "All categories deselected"
    });
  };
  
  // RSVP handler function
  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!userId) {
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

  return {
    events,
    isLoading,
    error,
    refetch,
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    rsvpLoading,
    availableEventTypes,
    availableVenues,
    showNoExactMatchesMessage,
    exactMatches,
    similarEvents,
    hasActiveFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    selectAllEventTypes,
    deselectAllEventTypes,
    handleEventRsvp,
    setSimilarEvents
  };
};
