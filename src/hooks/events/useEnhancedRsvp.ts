
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
        console.log('RSVP update successful, invalidating queries');
        
        // Perform more aggressive cache invalidation
        // First invalidate all events-related queries
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        queryClient.invalidateQueries({ queryKey: ['filtered-events'] });
        queryClient.invalidateQueries({ queryKey: ['userEvents'] });
        queryClient.invalidateQueries({ queryKey: ['user-events'] });
        
        // Also invalidate the entire user-events-related cache
        queryClient.invalidateQueries({ queryKey: ['user-events'] });
        
        // Also update the cache directly for immediate UI feedback
        updateEventsCache(eventId, newStatus, oldStatus);
        updateEventCache(eventId, newStatus, oldStatus);
      }
      
      return success;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
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
      return { ...oldData, rsvp_status: newStatus };
    });
  };
  
  // Helper function to update events list cache
  const updateEventsCache = (eventId: string, newStatus: string | null, oldStatus: string | null) => {
    // Update all events caches that might contain this event
    const updateEventInList = (events: any[]) => {
      if (!events || !Array.isArray(events)) return events;
      
      return events.map((event: any) => {
        if (event.id === eventId) {
          return { ...event, rsvp_status: newStatus };
        }
        return event;
      });
    };
    
    // Update events in main events list cache
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      return updateEventInList(oldData);
    });
    
    // Also update filtered events cache
    queryClient.setQueriesData({ queryKey: ['filtered-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      return updateEventInList(oldData);
    });
    
    // Update events in user events cache
    queryClient.setQueriesData({ queryKey: ['userEvents'] }, (oldData: any) => {
      if (!oldData || !oldData.upcomingEvents) return oldData;
      
      return {
        ...oldData,
        upcomingEvents: updateEventInList(oldData.upcomingEvents),
        pastEvents: updateEventInList(oldData.pastEvents)
      };
    });
  };

  return {
    handleRsvp,
    loadingEventId,
  };
};
