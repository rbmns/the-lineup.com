
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
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        queryClient.invalidateQueries({ queryKey: ['filtered-events'] });
        queryClient.invalidateQueries({ queryKey: ['userEvents'] });
        queryClient.invalidateQueries({ queryKey: ['user-events'] });
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

  return {
    handleRsvp,
    loadingEventId,
  };
};
