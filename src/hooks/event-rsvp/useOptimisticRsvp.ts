
import { useCallback, useState } from 'react';
import { useCacheUpdater } from './useCacheUpdater';
import { useRsvpMutation } from './useRsvpMutation';

/**
 * Hook that provides optimistic RSVP updates with proper filter and scroll preservation
 */
export const useOptimisticRsvp = (userId: string | undefined) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { updateAllCaches } = useCacheUpdater();
  const { mutateRsvp } = useRsvpMutation();

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      console.log("User not logged in");
      return false;
    }

    // Store current state before RSVP operation with more precision
    const scrollPosition = window.scrollY;
    const currentUrl = window.location.href;
    const urlParams = window.location.search;
    const eventTypesParam = new URLSearchParams(urlParams).getAll('eventType');
    
    // Check if we're on the events page
    const isEventsPage = window.location.pathname.includes('/events');
    
    // Save active filters to sessionStorage as a comprehensive backup
    if (isEventsPage) {
      try {
        const filterState = {
          scrollPosition,
          urlParams,
          eventTypes: eventTypesParam,
          timestamp: Date.now(),
          url: currentUrl,
          pathname: window.location.pathname
        };
        
        // Store complete filter state as JSON
        sessionStorage.setItem('rsvpFilterState', JSON.stringify(filterState));
        sessionStorage.setItem('lastRsvpScrollPosition', scrollPosition.toString());
        sessionStorage.setItem('lastRsvpUrlParams', urlParams);
        sessionStorage.setItem('lastRsvpEventTypes', JSON.stringify(eventTypesParam));
        sessionStorage.setItem('lastRsvpTimestamp', Date.now().toString());
        console.log(`Saved filter state to session storage:`, filterState);
      } catch (e) {
        console.error("Failed to save filter state to sessionStorage", e);
      }
    }
    
    // Set global flag to prevent unwanted state resets - with a more distinctive name
    if (typeof window !== 'undefined') {
      window.rsvpInProgress = true;
      // Add a data attribute to the body to mark RSVP in progress - useful for debugging
      document.body.setAttribute('data-rsvp-in-progress', 'true');
      
      // Add a block event listener that will prevent URL changes during RSVP
      const blockUrlChangeListener = (e: Event) => {
        if (window.rsvpInProgress && (e.type === 'popstate' || e.type === 'pushstate')) {
          console.log('Blocking URL change during RSVP operation');
          e.stopImmediatePropagation();
          e.preventDefault();
          return false;
        }
      };
      
      // Add listeners to prevent URL changes
      window.addEventListener('popstate', blockUrlChangeListener, true);
      window.addEventListener('pushstate', blockUrlChangeListener, true);
      
      // Store the listener for cleanup
      window._rsvpBlockUrlChangeListener = blockUrlChangeListener;
    }
    
    console.log(`OptimisticRsvp: Starting RSVP for event ${eventId}, status ${status}`);
    console.log(`Saving state - Scroll: ${scrollPosition}px, URL: ${currentUrl}, Params: ${urlParams}`);
    
    setLoadingEventId(eventId);
    
    try {
      // Perform the RSVP mutation
      const { success, newStatus, oldStatus } = await mutateRsvp(userId, eventId, status);
      
      if (success) {
        // Update caches directly without invalidating queries
        updateAllCaches(eventId, userId, newStatus, oldStatus);
        
        // Add a small delay before checking if we need to restore state
        // Increased to 250ms for better reliability
        await new Promise(resolve => setTimeout(resolve, 250));
        
        // Check if URL parameters changed during the RSVP operation
        const currentParams = window.location.search;
        if (isEventsPage && urlParams !== currentParams) {
          console.log('Filter state changed during RSVP, restoring URL params:', urlParams);
          
          try {
            // Use history.replaceState with the complete URL to ensure all parameters are preserved
            const baseUrl = window.location.pathname;
            window.history.replaceState({}, '', `${baseUrl}${urlParams}`);
            console.log(`Restored URL to: ${baseUrl}${urlParams}`);
            
            // Get event types from URLs
            const oldEventTypes = new URLSearchParams(urlParams).getAll('eventType');
            const newEventTypes = new URLSearchParams(currentParams).getAll('eventType');
            
            if (JSON.stringify(oldEventTypes) !== JSON.stringify(newEventTypes)) {
              console.log('Event type parameters changed, checking UI state for updates...');
              
              // Emit a custom event to notify components about the filter restoration
              const filterRestoredEvent = new CustomEvent('filtersRestored', { 
                detail: { eventTypes: oldEventTypes, urlParams } 
              });
              document.dispatchEvent(filterRestoredEvent);
            }
          } catch (e) {
            console.error("Failed to restore URL parameters:", e);
            
            // Fallback: Try to force reload the state from sessionStorage
            try {
              const savedState = sessionStorage.getItem('rsvpFilterState');
              if (savedState) {
                const parsedState = JSON.parse(savedState);
                if (parsedState.urlParams && Date.now() - parsedState.timestamp < 60000) {
                  console.log('Using fallback filter state restoration from session storage');
                  window.history.replaceState({}, '', `${parsedState.pathname}${parsedState.urlParams}`);
                }
              }
            } catch (fallbackError) {
              console.error("Fallback restoration also failed:", fallbackError);
            }
          }
        }
        
        // Check if scroll position needs restoration
        const scrollDiff = Math.abs(window.scrollY - scrollPosition);
        if (scrollDiff > 50) {
          console.log(`Scroll position changed (diff: ${scrollDiff}px), restoring to ${scrollPosition}px`);
          window.scrollTo({ top: scrollPosition, behavior: 'auto' });
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error in optimistic RSVP:", error);
      return false;
    } finally {
      // Add a larger delay before clearing state
      // This ensures any React updates have time to complete
      setTimeout(() => {
        setLoadingEventId(null);
        
        // Reset global flag and remove event listeners
        if (typeof window !== 'undefined') {
          window.rsvpInProgress = false;
          document.body.removeAttribute('data-rsvp-in-progress');
          
          // Remove the block URL change listener if it exists
          if (window._rsvpBlockUrlChangeListener) {
            window.removeEventListener('popstate', window._rsvpBlockUrlChangeListener, true);
            window.removeEventListener('pushstate', window._rsvpBlockUrlChangeListener, true);
            delete window._rsvpBlockUrlChangeListener;
          }
        }
        
        console.log(`OptimisticRsvp: Completed RSVP operation for ${eventId}`);
      }, 300); // Increased to 300ms for better reliability
    }
  }, [userId, mutateRsvp, updateAllCaches]);

  return {
    handleRsvp,
    loadingEventId
  };
};
