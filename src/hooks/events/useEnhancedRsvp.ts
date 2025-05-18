
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
        
        // Use more aggressive cache invalidation to ensure all event-related queries are updated
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        queryClient.invalidateQueries({ queryKey: ['filtered-events'] });
        queryClient.invalidateQueries({ queryKey: ['userEvents'] });
        queryClient.invalidateQueries({ queryKey: ['user-events'] });
        
        // Also update the cache directly for the specific event
        updateEventCache(eventId, status, oldStatus);
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

  // Helper function to directly update the cache for immediate UI feedback
  const updateEventCache = (eventId: string, newStatus: string | null, oldStatus: string | null) => {
    // Update event in events list cache
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      return oldData.map((event: any) => {
        if (event.id === eventId) {
          return { ...event, rsvp_status: newStatus };
        }
        return event;
      });
    });
    
    // Update specific event in event detail cache
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      return { ...oldData, rsvp_status: newStatus };
    });
  };

  return {
    handleRsvp,
    loadingEventId,
  };
};
