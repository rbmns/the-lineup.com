
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export const useEnhancedRsvp = (userId: string | undefined) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      return false;
    }

    console.log(`Handling RSVP for user=${userId}, eventId=${eventId}, status=${status}`);
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
      
      // Invalidate all relevant caches to ensure consistency across the app
      if (success) {
        console.log(`RSVP update successful for event ${eventId}, invalidating queries`);
        
        // Use a more aggressive invalidation approach to ensure sync
        // Invalidate all events-related queries including filtered events
        queryClient.invalidateQueries();
        
        // Direct cache updates for immediate UI feedback
        updateEventsCache(eventId, newStatus, oldStatus);
        updateEventCache(eventId, newStatus, oldStatus);
      }
      
      return success;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
      // Add a slight delay before removing the loading state for better UX
      setTimeout(() => {
        setLoadingEventId(null);
      }, 500);
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
  
  // Helper function to update events list cache
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
    
    // Update every possible events cache
    // Main events list
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      return updateEventInList(oldData);
    });
    
    // Filtered events cache
    queryClient.setQueriesData({ queryKey: ['filtered-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      return updateEventInList(oldData);
    });
    
    // User events cache
    queryClient.setQueriesData({ queryKey: ['userEvents'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      if (oldData.upcomingEvents) {
        return {
          ...oldData,
          upcomingEvents: updateEventInList(oldData.upcomingEvents),
          pastEvents: oldData.pastEvents ? updateEventInList(oldData.pastEvents) : []
        };
      }
      return oldData;
    });
  };

  return {
    handleRsvp,
    loadingEventId,
  };
};
