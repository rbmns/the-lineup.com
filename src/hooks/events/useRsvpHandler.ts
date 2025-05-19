
import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

/**
 * A hook to handle RSVP actions with proper caching to maintain RSVP state across pages
 * while preserving filter state
 */
export const useRsvpHandler = (
  user: User | null | undefined,
  handleRsvp: ((eventId: string, status: "Going" | "Interested") => Promise<boolean>) | undefined,
  rsvpInProgressRef: React.MutableRefObject<boolean>
) => {
  const queryClient = useQueryClient();
  
  const handleEventRsvp = useCallback(async (
    eventId: string, 
    status: "Going" | "Interested"
  ): Promise<boolean | void> => {
    if (!user || !handleRsvp) {
      return false;
    }

    // Store current filter state and scroll position
    const scrollPosition = window.scrollY;
    const urlSearchParams = window.location.search;
    
    // Get filter states from session storage if available
    let storedCategoryFilters = null;
    try {
      const categoryFiltersRaw = sessionStorage.getItem('event-category-filters');
      if (categoryFiltersRaw) {
        storedCategoryFilters = JSON.parse(categoryFiltersRaw);
      }
    } catch (e) {
      console.error("Error reading stored category filters:", e);
    }
    
    // Use event ID specific check to prevent cross-event interference
    const eventRsvpKey = `rsvp-${eventId}`;
    if ((window as any)[eventRsvpKey]) {
      console.log(`RSVP request in progress for event: ${eventId}, please wait`);
      return false;
    }

    try {
      // Set event-specific lock
      (window as any)[eventRsvpKey] = true;
      rsvpInProgressRef.current = true;
      
      // Track start time for performance measurement
      const startTime = performance.now();
      const success = await handleRsvp(eventId, status);
      const endTime = performance.now();
      
      console.log(`RSVP operation completed in ${endTime - startTime}ms`);
      
      if (success) {
        // Instead of invalidating all queries, only invalidate the specific event
        // This helps preserve filter state
        console.log('Performing selective cache invalidation after successful RSVP');
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        
        // Don't invalidate these queries to preserve filter state
        // queryClient.invalidateQueries({ queryKey: ['events'] });
        // queryClient.invalidateQueries({ queryKey: ['filtered-events'] });
        
        // Give time for any React state updates to stabilize
        setTimeout(() => {
          // Restore scroll position
          window.scrollTo({
            top: scrollPosition,
            behavior: 'auto'
          });
          
          // If we're on the events page with filters, ensure the filters are preserved
          if (window.location.pathname.includes('/events') && urlSearchParams) {
            const currentParams = new URLSearchParams(window.location.search).toString();
            const originalParams = new URLSearchParams(urlSearchParams).toString();
            
            if (currentParams !== originalParams) {
              console.log("Restoring URL parameters:", originalParams);
              // Use history.replaceState to avoid triggering navigation
              window.history.replaceState(
                {}, 
                '', 
                `${window.location.pathname}?${originalParams}`
              );
            }
          }
          
          // If we had stored category filters, restore them
          if (storedCategoryFilters && Array.isArray(storedCategoryFilters)) {
            try {
              sessionStorage.setItem('event-category-filters', JSON.stringify(storedCategoryFilters));
            } catch (e) {
              console.error("Error restoring category filters:", e);
            }
          }
        }, 100);
      }
      
      return success;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
      // Small delay to prevent multiple rapid clicks
      setTimeout(() => {
        (window as any)[eventRsvpKey] = false;
        rsvpInProgressRef.current = false;
      }, 300);
    }
  }, [user, handleRsvp, rsvpInProgressRef, queryClient]);

  return { handleEventRsvp };
};
