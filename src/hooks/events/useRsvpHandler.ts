
import { useCallback, RefObject, useRef } from 'react';

export const useRsvpHandler = (
  user: any | null | undefined,
  rsvpFunction: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>,
  rsvpInProgressRef: RefObject<boolean>
) => {
  // Local mutable state to track RSVP progress
  const localRsvpInProgressRef = useRef<boolean>(false);
  
  // Helper to handle RSVP with proper flag management
  const handleEventRsvp = useCallback(async (
    eventId: string, 
    status: 'Going' | 'Interested'
  ): Promise<boolean> => {
    if (!user || !rsvpFunction) return false;

    // Store filter and scroll state
    const currentUrl = window.location.href;
    const currentScroll = window.scrollY;
    const currentSearch = window.location.search;
    
    try {
      // Set flag to prevent unwanted resets
      if (rsvpInProgressRef) {
        // Using the mutable local ref
        localRsvpInProgressRef.current = true;
        
        // Set the global ref if available
        if (typeof window !== 'undefined') {
          window.rsvpInProgress = true;
        }
      }
      
      console.log(`useRsvpHandler - Starting RSVP operation: ${eventId}, ${status}`);
      console.log(`Current state - URL: ${currentUrl}, Scroll: ${currentScroll}px`);
      
      // Perform the RSVP action
      const result = await rsvpFunction(eventId, status);
      
      // Add a delay to ensure UI updates complete before we check/restore state
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Check if we need to restore filter state
      const urlChanged = currentSearch !== window.location.search;
      if (urlChanged && window.location.pathname.includes('/events')) {
        console.log('Filter state lost during RSVP, restoring');
        window.history.replaceState({}, '', `${window.location.pathname}${currentSearch}`);
      }
      
      // Check if we need to restore scroll position
      const scrollChanged = Math.abs(currentScroll - window.scrollY) > 100;
      if (scrollChanged) {
        console.log(`Scroll position changed during RSVP, restoring to ${currentScroll}px`);
        window.scrollTo({ top: currentScroll, behavior: 'auto' });
      }
      
      return result;
    } catch (error) {
      console.error("Error in RSVP handler:", error);
      return false;
    } finally {
      // Small delay before resetting flag to ensure all callbacks complete
      setTimeout(() => {
        localRsvpInProgressRef.current = false;
        
        // Reset global values using type-safe approach
        if (typeof window !== 'undefined') {
          window.rsvpInProgress = false;
        }
        
        console.log('useRsvpHandler - Reset RSVP in progress flag');
      }, 150);
    }
  }, [user, rsvpFunction, rsvpInProgressRef]);

  // Add utility to get current RSVP state
  const isRsvpInProgress = useCallback(() => {
    return localRsvpInProgressRef.current || (rsvpInProgressRef ? rsvpInProgressRef.current : false);
  }, [rsvpInProgressRef]);

  return { handleEventRsvp, isRsvpInProgress };
};
