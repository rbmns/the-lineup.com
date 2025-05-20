
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

    // Store current state before RSVP operation
    const scrollPosition = window.scrollY;
    const currentUrl = window.location.href;
    const urlParams = window.location.search;
    
    // Set global flag to prevent unwanted state resets
    if (typeof window !== 'undefined') {
      window.rsvpInProgress = true;
    }
    
    console.log(`OptimisticRsvp: Starting RSVP for event ${eventId}, status ${status}`);
    console.log(`Saving state - Scroll: ${scrollPosition}px, URL: ${currentUrl}`);
    
    setLoadingEventId(eventId);
    
    try {
      // Perform the RSVP mutation
      const { success, newStatus, oldStatus } = await mutateRsvp(userId, eventId, status);
      
      if (success) {
        // Update caches directly without invalidating queries
        updateAllCaches(eventId, userId, newStatus, oldStatus);
        
        // Add a small delay before checking if we need to restore state
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Check if URL parameters changed during the RSVP operation
        const currentParams = window.location.search;
        if (window.location.pathname.includes('/events') && urlParams !== currentParams) {
          console.log('Filter state changed during RSVP, restoring URL params:', urlParams);
          window.history.replaceState({}, '', `${window.location.pathname}${urlParams}`);
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
      setTimeout(() => {
        setLoadingEventId(null);
        
        // Reset global flag
        if (typeof window !== 'undefined') {
          window.rsvpInProgress = false;
        }
        
        console.log(`OptimisticRsvp: Completed RSVP operation for ${eventId}`);
      }, 150);
    }
  }, [userId, mutateRsvp, updateAllCaches]);

  return {
    handleRsvp,
    loadingEventId
  };
};
