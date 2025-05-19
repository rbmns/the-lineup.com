
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export const useEnhancedRsvp = (userId: string | undefined) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      console.log('Cannot RSVP: No user ID provided');
      return false;
    }

    // Store scroll position before any DB operations
    const scrollPosition = window.scrollY;
    console.log(`Saving scroll position: ${scrollPosition}px`);

    // Store active filter state from URL
    const currentUrl = new URL(window.location.href);
    const eventTypesParam = currentUrl.searchParams.get('eventTypes');
    const urlParams = new URLSearchParams(window.location.search);
    
    console.log(`Handling RSVP for user=${userId}, eventId=${eventId}, status=${status}`);
    console.log(`Current filter state (URL): ${window.location.search}`);
    setLoadingEventId(eventId);
    
    try {
      // First check if the user already has an RSVP for this event
      const { data: existingRsvp } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      let success = false;
      let oldStatus = existingRsvp?.status;
      let newStatus = status;
      
      if (existingRsvp) {
        console.log('Found existing RSVP:', existingRsvp);
        // Toggle behavior: if same status, remove it; if different, update it
        if (existingRsvp.status === status) {
          // Remove RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);
            
          if (error) {
            throw error;
          }
          success = true;
          newStatus = null; // Set to null when removing
        } else {
          // Update to new status
          const { error } = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);
            
          if (error) {
            throw error;
          }
          success = true;
        }
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert([{ event_id: eventId, user_id: userId, status }]);
          
        if (error) {
          throw error;
        }
        success = true;
      }
      
      // Use surgical cache updates instead of invalidating all queries
      if (success) {
        console.log(`RSVP update successful for event ${eventId}, performing selective cache updates`);
        
        // Only invalidate the specific event query to refresh its data
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        
        // Update all events caches that might contain this event without invalidating
        updateEventsCache(eventId, newStatus, oldStatus);
        updateEventCache(eventId, newStatus, oldStatus);
        
        console.log("RSVP Cache updates complete - surgical updates applied");
        
        // Try to restore the scroll position and URL params after a short delay
        setTimeout(() => {
          // Restore scroll position
          window.scrollTo({
            top: scrollPosition,
            behavior: 'auto'
          });
          
          // If we're on the events page and had filters, reapply them
          if (window.location.pathname.includes('/events') && eventTypesParam) {
            // This preserves the filter state without causing navigation
            if (urlParams.toString() !== new URLSearchParams(window.location.search).toString()) {
              console.log("Preserving URL filters:", urlParams.toString());
              // Use history.replaceState to avoid triggering navigation
              window.history.replaceState(
                {}, 
                '', 
                `${window.location.pathname}?${urlParams.toString()}`
              );
            }
          }
        }, 50);
      }
      
      return success;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
      // Add a slight delay before removing the loading state for better UX
      setTimeout(() => {
        setLoadingEventId(null);
      }, 300);
    }
  };

  // Helper function to directly update the single event cache
  const updateEventCache = (eventId: string, newStatus: string | null, oldStatus: string | null) => {
    // Update specific event in event detail cache
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      console.log(`Directly updating event cache for event ${eventId}, setting status to ${newStatus}`);
      return { ...oldData, rsvp_status: newStatus };
    });
  };
  
  // Helper function to update events list cache without invalidation
  const updateEventsCache = (eventId: string, newStatus: string | null, oldStatus: string | null) => {
    console.log(`Directly updating events cache for event ${eventId}, setting status to ${newStatus}`);
    
    // Update all events caches that might contain this event
    const updateEventInList = (events: any[]) => {
      if (!events || !Array.isArray(events)) return events;
      
      return events.map((event: any) => {
        if (event.id === eventId) {
          console.log(`Found event ${eventId} in cached list, updating status to ${newStatus}`);
          return { ...event, rsvp_status: newStatus };
        }
        return event;
      });
    };
    
    // Update events cache - only modify the RSVP status without losing filter state
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      if (Array.isArray(oldData)) {
        return updateEventInList(oldData);
      }
      return oldData;
    });
    
    // Also update filtered-events cache if it exists
    queryClient.setQueriesData({ queryKey: ['filtered-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      if (Array.isArray(oldData)) {
        return updateEventInList(oldData);
      }
      return oldData;
    });
    
    // Handle other cache formats like paginated data
    const queries = queryClient.getQueriesData({});
    
    queries.forEach(([queryKey, data]: [any, any]) => {
      // Only check queries that might contain events to reduce overhead
      const keyString = JSON.stringify(queryKey);
      if (keyString.includes('events') || keyString.includes('event-') || keyString.includes('Events')) {
        if (data && typeof data === 'object') {
          // Handle nested data structures
          if (data.data && Array.isArray(data.data)) {
            // Paginated data format
            queryClient.setQueryData(queryKey, {
              ...data,
              data: updateEventInList(data.data)
            });
          }
        }
      }
    });
  };

  return {
    handleRsvp,
    loadingEventId,
  };
};
