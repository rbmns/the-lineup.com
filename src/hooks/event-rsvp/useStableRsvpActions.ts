
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useCacheUpdater } from './useCacheUpdater';

/**
 * Hook that provides stable RSVP actions with optimistic UI updates
 */
export const useStableRsvpActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { updateAllCaches } = useCacheUpdater();

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      console.log("User not logged in");
      return false;
    }

    // Store current state before RSVP operation
    const scrollPosition = window.scrollY;
    const currentUrl = window.location.href;
    const urlParams = window.location.search;
    
    // Save filter state to sessionStorage as backup
    if (window.location.pathname.includes('/events')) {
      try {
        sessionStorage.setItem('lastRsvpScrollPosition', scrollPosition.toString());
        sessionStorage.setItem('lastRsvpUrlParams', urlParams);
        sessionStorage.setItem('lastRsvpTimestamp', Date.now().toString());
      } catch (e) {
        console.error("Failed to save state to sessionStorage:", e);
      }
    }
    
    // Set global flag to prevent unwanted state resets
    if (typeof window !== 'undefined') {
      window.rsvpInProgress = true;
    }

    console.log(`StableRsvp: User ${userId}, Event ${eventId}, Status ${status}`);
    setLoading(true);
    
    try {
      // Get current RSVP status to determine toggle behavior
      const checkResult = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
        
      if (checkResult.error) {
        console.error("Error checking existing RSVP:", checkResult.error);
        throw checkResult.error;
      }
        
      const existingRsvp = checkResult.data;
      let newRsvpStatus: 'Going' | 'Interested' | null = null;
      const oldRsvpStatus = existingRsvp?.status as 'Going' | 'Interested' | null;
      
      // If clicking the same status button that's already active, toggle it off
      if (existingRsvp && existingRsvp.status === status) {
        // Toggle off - delete the RSVP
        console.log("Deleting RSVP (toggle off)");
        const deleteResult = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', existingRsvp.id);
          
        if (deleteResult.error) {
          console.error("Error deleting RSVP:", deleteResult.error);
          throw deleteResult.error;
        }
        
        newRsvpStatus = null;
      } else if (existingRsvp) {
        // Update existing RSVP to new status
        console.log("Updating RSVP status to:", status);
        const updateResult = await supabase
          .from('event_rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);
          
        if (updateResult.error) {
          console.error("Error updating RSVP:", updateResult.error);
          throw updateResult.error;
        }
        
        newRsvpStatus = status;
      } else {
        // Create new RSVP
        console.log("Creating new RSVP with status:", status);
        const insertResult = await supabase
          .from('event_rsvps')
          .insert({
            user_id: userId,
            event_id: eventId,
            status,
          });
          
        if (insertResult.error) {
          console.error("Error creating RSVP:", insertResult.error);
          throw insertResult.error;
        }
        
        newRsvpStatus = status;
      }

      // Use surgical cache updates instead of invalidating queries
      updateAllCaches(eventId, userId, newRsvpStatus, oldRsvpStatus);
      
      // Add a small delay before checking if we need to restore state
      await new Promise(resolve => setTimeout(resolve, 150));
      
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
      
      console.log(`StableRsvp: Successfully ${newRsvpStatus ? 'updated' : 'removed'} RSVP`);
      
      return true;
    } catch (error) {
      console.error("Error in StableRsvpActions:", error);
      return false;
    } finally {
      setLoading(false);
      
      // Reset global flag
      if (typeof window !== 'undefined') {
        window.rsvpInProgress = false;
      }
    }
  }, [userId, updateAllCaches]);

  return {
    handleRsvp,
    loading
  };
};
