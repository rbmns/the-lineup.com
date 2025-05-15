
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRsvpActions } from './useRsvpActions';
import { useEventFetcher } from './useEventFetcher';
import { useEventRSVP } from './event-rsvp/useEventRSVP';
import { toast } from './use-toast';
import { useEventLookup } from './useEventLookup';

export const useEventDetails = (
  eventId?: string, 
  userId?: string, 
  eventSlug?: string,
  destination?: string
) => {
  const { handleRsvp, loading: rsvpLoading } = useRsvpActions(userId);
  const { getAttendeesForEvent } = useEventRSVP();
  const [fetchTriggered, setFetchTriggered] = useState(false);
  const [lastFetchParams, setLastFetchParams] = useState<string | null>(null);
  const { lookupEventBySlug } = useEventLookup();
  
  const {
    event,
    setEvent,
    attendees,
    setAttendees,
    isLoading,
    setIsLoading,
    error,
    setError,
    fetchEventAndAttendees
  } = useEventFetcher(userId);

  // Generate a unique param string to detect changes without unnecessary re-fetches
  const fetchParamsString = useCallback(() => {
    return `${eventId || ''}|${eventSlug || ''}|${destination || ''}`;
  }, [eventId, eventSlug, destination]);

  // Prevent unnecessary fetches when no parameters have changed
  const shouldFetchData = useCallback(() => {
    const currentParams = fetchParamsString();
    
    // If we have no parameters, don't fetch
    if (!eventId && !eventSlug) {
      console.log("No fetch params available");
      return false;
    }
    
    // If params haven't changed and we've already fetched, don't fetch again
    if (currentParams === lastFetchParams && fetchTriggered) {
      console.log("Skipping fetch - params unchanged", currentParams);
      return false;
    }
    
    console.log("New fetch params detected", currentParams);
    return true;
  }, [fetchParamsString, lastFetchParams, eventId, eventSlug, fetchTriggered]);

  const fetchWithParams = useCallback(async () => {
    if (!shouldFetchData()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log(`Fetching event data with params: ID=${eventId}, slug=${eventSlug}, destination=${destination}`);
      
      const result = await fetchEventAndAttendees(eventId, eventSlug, destination);
      
      // Update last fetch params to prevent duplicate fetches
      setLastFetchParams(fetchParamsString());
      setFetchTriggered(true);
      
      return result;
    } catch (err) {
      console.error("Error in fetchWithParams:", err);
      setError(err instanceof Error ? err : new Error("Error fetching event"));
    } finally {
      setIsLoading(false);
    }
  }, [eventId, eventSlug, destination, fetchEventAndAttendees, setIsLoading, setError, fetchParamsString, shouldFetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchWithParams();
  }, [fetchWithParams]);

  // Modified to take only the status parameter
  const handleRsvpAction = useCallback(async (status: 'Going' | 'Interested') => {
    if (!event?.id || !userId) return false;
    
    try {
      const result = await handleRsvp(event.id, status);
      
      if (result) {
        setEvent(prevEvent => {
          if (!prevEvent) return prevEvent;
          return { 
            ...prevEvent, 
            rsvp_status: prevEvent.rsvp_status === status ? undefined : status 
          };
        });
        
        try {
          // Refetch attendees after RSVP action
          const updatedAttendees = await getAttendeesForEvent(event.id);
          setAttendees(updatedAttendees);
        } catch (error) {
          console.error('Error updating attendees list:', error);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating RSVP:', err);
      toast({
        title: "Error",
        description: "Failed to update your RSVP status",
        variant: "destructive"
      });
      return false;
    }
  }, [event?.id, userId, handleRsvp, getAttendeesForEvent, setAttendees, setEvent]);

  const refreshData = useCallback(() => {
    console.log("Manual refresh requested");
    setFetchTriggered(false); // Reset fetch state to force a new fetch
    fetchWithParams();
  }, [fetchWithParams]);

  return {
    event,
    attendees,
    isLoading,
    error,
    rsvpLoading,
    handleRsvpAction,
    refreshData,
    lookupEventBySlug
  };
};
