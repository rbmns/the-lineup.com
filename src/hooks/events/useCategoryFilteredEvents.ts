
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { useEventFilteringEngine } from '@/hooks/events/useEventFilteringEngine';
import { useSimilarEventsHandler } from '@/hooks/events/useSimilarEventsHandler';
import { useAvailableFilterOptions } from '@/hooks/events/useAvailableFilterOptions';
import { useFilterRemovalHandlers } from '@/hooks/events/useFilterRemovalHandlers';
import { DateRange } from 'react-day-picker';
import { Event } from '@/types';

export const useCategoryFilteredEvents = (categorySlug: string | undefined) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { user } = useAuth();
  const { handleRsvp, loading: rsvpLoading } = useRsvpActions();
  
  // Use the eventFilterState hook for all filter-related state
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
    setIsFilterLoading,
    hasActiveFilters,
    resetFilters,
  } = useEventFilterState();
  
  // Get available filter options from events
  const {
    availableEventTypes,
    availableVenues,
  } = useAvailableFilterOptions(events);
  
  // Filter handlers for removing individual filters
  const {
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter
  } = useFilterRemovalHandlers(
    setSelectedEventTypes,
    setSelectedVenues,
    setDateRange,
    setSelectedDateFilter
  );
  
  // Filter events based on selected criteria
  const {
    exactMatches,
    showNoExactMatchesMessage,
  } = useEventFilteringEngine({
    events,
    selectedEventTypes,
    selectedVenues,
    dateRange,
    selectedDateFilter,
    hasActiveFilters,
    setIsFilterLoading,
  });
  
  // Fetch events for the given category
  useEffect(() => {
    const fetchEvents = async () => {
      if (!categorySlug) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            venues:venue_id (*),
            creator:profiles (*),
            event_rsvps (*)
          `)
          .eq('event_type', categorySlug)
          .order('start_date', { ascending: true });
        
        if (error) {
          console.error('Error fetching events by category:', error);
          return;
        }
        
        if (data) {
          const processedEvents = processEventsData(data, user?.id);
          setEvents(processedEvents);
        }
      } catch (err) {
        console.error('Error in category events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [categorySlug, user?.id]);
  
  // Fetch similar events when there are no exact matches
  const fetchSimilarEvents = async (
    eventTypes: string[],
    eventsData?: Event[]
  ): Promise<Event[]> => {
    if (!eventTypes.length) return [];
    
    try {
      // Simple implementation: just return events of the selected types
      // In a real app, you might want to implement more sophisticated logic
      return (eventsData || events).filter(event => 
        eventTypes.includes(event.event_type as string)
      );
    } catch (error) {
      console.error("Error fetching similar events:", error);
      return [];
    }
  };
  
  // Use the useSimilarEventsHandler hook correctly with a single object parameter
  const { similarEvents: fetchedSimilarEvents = [] } = useSimilarEventsHandler({
    mainEvents: exactMatches,
    hasActiveFilters,
    selectedEventTypes,
    dateRange,
    selectedDateFilter,
    userId: user?.id
  });
  
  // Update similarEvents state when fetchedSimilarEvents changes
  useEffect(() => {
    setSimilarEvents(fetchedSimilarEvents);
  }, [fetchedSimilarEvents]);
  
  // Handle RSVP actions with loading state
  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<void> => {
    setLoadingEventId(eventId);
    
    try {
      // Simply pass through to the handleRsvp function from useRsvpActions
      await handleRsvp(eventId, status);
      
      // After successful RSVP, update the events list with the new status
      setEvents(prevEvents => 
        prevEvents.map(event => {
          if (event.id === eventId) {
            // If the status is the same as current, remove it (toggle behavior)
            const newStatus = event.rsvp_status === status ? undefined : status;
            return {
              ...event,
              rsvp_status: newStatus
            };
          }
          return event;
        })
      );
    } finally {
      setLoadingEventId(null);
    }
  };
  
  // Functions for handling "Select All" and "Deselect All" actions
  const selectAllEventTypes = () => {
    const allTypes = availableEventTypes.map(type => type.value);
    setSelectedEventTypes(allTypes);
  };
  
  const deselectAllEventTypes = () => {
    setSelectedEventTypes([]);
  };
  
  return {
    // Base event data and loading state
    events,
    isLoading,
    
    // Filter options
    availableEventTypes,
    availableVenues,
    
    // Filter state
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    
    // Filtered event data
    exactMatches,
    similarEvents: fetchedSimilarEvents, // Use the fetched similar events here
    showNoExactMatchesMessage,
    hasActiveFilters,
    
    // Filter actions
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    selectAllEventTypes,
    deselectAllEventTypes,
    
    // RSVP handling
    loadingEventId,
    handleEventRsvp,
    rsvpLoading,
  };
};
