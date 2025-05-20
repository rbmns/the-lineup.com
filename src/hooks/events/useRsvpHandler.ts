
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
    const eventTypesParam = new URLSearchParams(currentSearch).getAll('eventType');
    
    // Save complete state to session storage as backup
    try {
      const filterState = {
        scrollPosition: currentScroll,
        urlParams: currentSearch,
        eventTypes: eventTypesParam,
        timestamp: Date.now(),
        url: currentUrl,
        pathname: window.location.pathname
      };
      
      sessionStorage.setItem('rsvpFilterStateBackup', JSON.stringify(filterState));
      console.log('Saved RSVP filter state backup:', filterState);
    } catch (e) {
      console.error('Failed to save filter state backup to session storage:', e);
    }
    
    try {
      // Set flag to prevent unwanted resets
      if (rsvpInProgressRef) {
        // Using the mutable local ref
        localRsvpInProgressRef.current = true;
        
        // Set the global ref if available
        if (typeof window !== 'undefined') {
          window.rsvpInProgress = true;
          document.body.setAttribute('data-rsvp-in-progress', 'true');
          
          // Store state in window for potential restoration
          window._filterStateBeforeRsvp = {
            urlParams: currentSearch,
            scrollPosition: currentScroll,
            timestamp: Date.now()
          };
          
          // Add event listeners to block URL changes during RSVP
          const blockUrlChangeListener = (e: Event) => {
            if (window.rsvpInProgress) {
              console.log('Blocking URL change during RSVP operation');
              e.stopImmediatePropagation();
              e.preventDefault();
              return false;
            }
          };
          
          window.addEventListener('popstate', blockUrlChangeListener, true);
          window.addEventListener('pushstate', blockUrlChangeListener, true);
          window._rsvpBlockUrlChangeListener = blockUrlChangeListener;
        }
      }
      
      console.log(`useRsvpHandler - Starting RSVP operation: ${eventId}, ${status}`);
      console.log(`Current state - URL: ${currentUrl}, Scroll: ${currentScroll}px, Search: ${currentSearch}`);
      
      // Perform the RSVP action
      const result = await rsvpFunction(eventId, status);
      
      // Add a delay to ensure UI updates complete before we check/restore state
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Check if we need to restore filter state - using complex comparison
      const urlChanged = currentSearch !== window.location.search;
      const eventTypesBefore = new URLSearchParams(currentSearch).getAll('eventType');
      const eventTypesAfter = new URLSearchParams(window.location.search).getAll('eventType');
      const eventTypesChanged = JSON.stringify(eventTypesBefore) !== JSON.stringify(eventTypesAfter);
      
      if ((urlChanged || eventTypesChanged) && window.location.pathname.includes('/events')) {
        console.log('Filter state changed during RSVP, restoring:');
        console.log('- Before:', currentSearch, eventTypesBefore);
        console.log('- After:', window.location.search, eventTypesAfter);
        
        // Apply restoration
        window.history.replaceState({}, '', `${window.location.pathname}${currentSearch}`);
        
        // Emit a custom event to notify components about the filter restoration
        const filterRestoredEvent = new CustomEvent('filtersRestored', { 
          detail: { 
            eventTypes: eventTypesBefore, 
            urlParams: currentSearch 
          } 
        });
        document.dispatchEvent(filterRestoredEvent);
        
        console.log('Filter state restored and notification event dispatched');
      }
      
      // Check if we need to restore scroll position
      const scrollDiff = Math.abs(currentScroll - window.scrollY);
      if (scrollDiff > 50) {
        console.log(`Scroll position changed (diff: ${scrollDiff}px), restoring to ${currentScroll}px`);
        window.scrollTo({ top: currentScroll, behavior: 'auto' });
      }
      
      return result;
    } catch (error) {
      console.error("Error in RSVP handler:", error);
      return false;
    } finally {
      // Extended delay before resetting flag to ensure all callbacks complete
      setTimeout(() => {
        localRsvpInProgressRef.current = false;
        
        // Reset global values using type-safe approach
        if (typeof window !== 'undefined') {
          window.rsvpInProgress = false;
          document.body.removeAttribute('data-rsvp-in-progress');
          
          // Remove the URL change block listeners if they exist
          if (window._rsvpBlockUrlChangeListener) {
            window.removeEventListener('popstate', window._rsvpBlockUrlChangeListener, true);
            window.removeEventListener('pushstate', window._rsvpBlockUrlChangeListener, true);
            delete window._rsvpBlockUrlChangeListener;
          }
        }
        
        console.log('useRsvpHandler - Reset RSVP in progress flag');
      }, 300);
    }
  }, [user, rsvpFunction, rsvpInProgressRef]);

  // Add utility to get current RSVP state
  const isRsvpInProgress = useCallback(() => {
    return localRsvpInProgressRef.current || (rsvpInProgressRef ? rsvpInProgressRef.current : false) || window.rsvpInProgress === true;
  }, [rsvpInProgressRef]);

  return { handleEventRsvp, isRsvpInProgress };
};
