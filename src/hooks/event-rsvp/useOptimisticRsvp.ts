
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
    
    // Check if we're on the events page
    const isEventsPage = window.location.pathname.includes('/events');
    
    // Save active filters to sessionStorage as a backup
    if (isEventsPage) {
      try {
        sessionStorage.setItem('lastRsvpScrollPosition', scrollPosition.toString());
        sessionStorage.setItem('lastRsvpUrlParams', urlParams);
        sessionStorage.setItem('lastRsvpTimestamp', Date.now().toString());
        console.log(`Saved filter state to session storage: ${urlParams}`);
      } catch (e) {
        console.error("Failed to save filter state to sessionStorage", e);
      }
    }
    
    // Set global flag to prevent unwanted state resets - with a more distinctive name
    if (typeof window !== 'undefined') {
      window.rsvpInProgress = true;
      // Add a data attribute to the body to mark RSVP in progress - useful for debugging
      document.body.setAttribute('data-rsvp-in-progress', 'true');
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
        // Increased to 150ms for better reliability
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Check if URL parameters changed during the RSVP operation
        const currentParams = window.location.search;
        if (isEventsPage && urlParams !== currentParams) {
          console.log('Filter state changed during RSVP, restoring URL params:', urlParams);
          
          try {
            // Use history.replaceState with the complete URL to ensure all parameters are preserved
            const baseUrl = window.location.pathname;
            window.history.replaceState({}, '', `${baseUrl}${urlParams}`);
            console.log(`Restored URL to: ${baseUrl}${urlParams}`);
          } catch (e) {
            console.error("Failed to restore URL parameters:", e);
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
      // Add a small delay before clearing state
      // This ensures any React updates have time to complete
      setTimeout(() => {
        setLoadingEventId(null);
        
        // Reset global flag
        if (typeof window !== 'undefined') {
          window.rsvpInProgress = false;
          document.body.removeAttribute('data-rsvp-in-progress');
        }
        
        console.log(`OptimisticRsvp: Completed RSVP operation for ${eventId}`);
      }, 200); // Increased to 200ms for better reliability
    }
  }, [userId, mutateRsvp, updateAllCaches]);

  return {
    handleRsvp,
    loadingEventId
  };
};
