
import { useState, useEffect } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { filterEventsByDateRange } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast'; // Assuming this is shadcn/ui toast based on project setup. If it's sonner, it might be `import { toast } from 'sonner';`

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
  
  // RSVP loading state - changed from rsvpLoading (boolean) to loadingEventId (string | null)
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  
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
    setSimilarEvents([]); // Reset similar events when primary filters change
    
    // Show "no exact matches" message if no events are found with active filters
    setShowNoExactMatchesMessage(filteredEvents.length === 0 && hasActiveFilters);
    
    // Simulate loading delay for UI effect
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);
  }, [events, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, hasActiveFilters]);
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
    // Using existing toast import
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
  
  // RSVP handler function - updated to use loadingEventId
  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      console.log("User not logged in, cannot RSVP");
      // Consider showing a toast message here for feedback
      // toast({ title: "Please log in to RSVP", variant: "destructive" });
      return false;
    }
    
    setLoadingEventId(eventId); // Set loading for the specific event
    
    try {
      console.log(`useCategoryFilteredEvents - RSVP handler called for event: ${eventId}, status: ${status}`);
      
      // Simulate RSVP action - In a real app, this would be an API call
      // For now, let's assume useEnhancedRsvp or similar is handling the actual Supabase call
      // and this hook's responsibility is to refetch data and manage UI state for this page.
      // If this hook is meant to *also* perform the RSVP, the logic from useStableRsvpActions
      // or similar should be integrated here. For now, assuming it's a UI/refetch trigger.
      
      // Example: if you need to call a generic RSVP function from another hook
      // const success = await someSharedRsvpFunction(userId, eventId, status);
      // if (!success) throw new Error("RSVP action failed");

      // Simulate delay for API call
      await new Promise(resolve => setTimeout(resolve, 700)); 
      
      toast({ // Using existing toast import
        title: `RSVP updated to ${status}`
      });
      
      // Refetch events to update the list with new RSVP status and attendee counts
      await refetch(); 
      
      return true;
    } catch (error) {
      console.error("Error in useCategoryFilteredEvents RSVP handler:", error);
      toast({ // Using existing toast import
        title: "Failed to update RSVP status",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoadingEventId(null); // Clear loading for the event
    }
  };

  return {
    events, // Original full list of events
    isLoading, // Loading state for initial events fetch
    error,
    refetch, // Function to refetch events

    // Filter states and setters
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,

    isFilterLoading, // Loading state specific to filter application
    loadingEventId, // Changed from rsvpLoading

    // Available filter options
    availableEventTypes,
    availableVenues,

    // Filtered results and UI states
    showNoExactMatchesMessage,
    exactMatches, // Events that match all active filters
    similarEvents, // Placeholder for similar events logic
    hasActiveFilters,

    // Filter actions
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    selectAllEventTypes,
    deselectAllEventTypes,

    // RSVP action
    handleEventRsvp,
    
    // Setter for similar events (if needed externally)
    setSimilarEvents
  };
};
