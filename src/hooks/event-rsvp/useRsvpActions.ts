
import { useState } from 'react';
import { useCacheUpdater } from './useCacheUpdater';
import { useRsvpMutation } from './useRsvpMutation';

export const useRsvpActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { updateAllCaches } = useCacheUpdater();
  const { mutateRsvp } = useRsvpMutation();

  const handleRsvp = async (eventId: string, status: 'Interested' | 'Going'): Promise<boolean> => {
    if (!userId) {
      // Don't show toast, just return false
      console.log('User not logged in, cannot RSVP');
      return false;
    }

    // Store filter state and scroll position
    const currentScrollPosition = window.scrollY;
    const currentUrlParams = window.location.search;
    const isEventsPage = window.location.pathname.includes('/events');
    
    // Set global RSVP in progress flag
    if (typeof window !== 'undefined') {
      window.rsvpInProgress = true;
    }

    console.log(`Handling RSVP: User ${userId}, Event ${eventId}, Status ${status}`);
    setLoading(true);
    
    try {
      // Perform the RSVP mutation and get results
      const { success, newStatus, oldStatus } = await mutateRsvp(userId, eventId, status);
      
      if (!success) {
        throw new Error('RSVP mutation failed');
      }
      
      // Update the cache directly
      updateAllCaches(eventId, userId, newStatus, oldStatus);
      
      // Check if we need to restore filter state (URL parameters)
      if (isEventsPage) {
        // Add a small delay to ensure all React updates have completed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const urlParamsChanged = currentUrlParams !== window.location.search;
        if (urlParamsChanged) {
          console.log('Filter state changed during RSVP, restoring URL params:', currentUrlParams);
          window.history.replaceState({}, '', `${window.location.pathname}${currentUrlParams}`);
        }
        
        // Check if scroll position changed significantly
        const scrollDiff = Math.abs(window.scrollY - currentScrollPosition);
        if (scrollDiff > 50) {
          console.log(`Scroll position changed (diff: ${scrollDiff}px), restoring to ${currentScrollPosition}px`);
          window.scrollTo({ top: currentScrollPosition, behavior: 'auto' });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error RSVPing to event:", error);
      return false;
    } finally {
      setLoading(false);
      
      // Reset global RSVP in progress flag
      if (typeof window !== 'undefined') {
        window.rsvpInProgress = false;
      }
    }
  };

  return {
    handleRsvp,
    loading
  };
};
