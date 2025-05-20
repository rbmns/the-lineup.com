
import { useState, useRef, useCallback } from 'react';
import { Event } from '@/types';

export const useEventListState = () => {
  // State for similar/related events
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  
  // Refs to track render and scroll state
  const initialRenderRef = useRef<boolean>(false);
  const scrollRestoredRef = useRef<boolean>(false);
  const rsvpInProgressRef = useRef<boolean>(false);
  
  // Function to mark RSVP as in progress (to prevent scroll position resets)
  const setRsvpInProgress = useCallback((inProgress: boolean) => {
    if (rsvpInProgressRef.current !== inProgress) {
      rsvpInProgressRef.current = inProgress;
      console.log(`RSVP in progress: ${inProgress}`);
      
      // Also set global flag if available
      if (window.rsvpInProgress !== undefined) {
        window.rsvpInProgress = inProgress;
      }
    }
  }, []);
  
  // Function to reset state for navigation
  const resetState = useCallback(() => {
    initialRenderRef.current = false;
    scrollRestoredRef.current = false;
  }, []);
  
  return {
    similarEvents,
    setSimilarEvents,
    initialRenderRef,
    scrollRestoredRef,
    rsvpInProgressRef,
    setRsvpInProgress,
    resetState
  };
};
