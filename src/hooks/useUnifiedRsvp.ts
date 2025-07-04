
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useUnifiedRsvp = () => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updateEventCaches = useCallback((eventId: string, newStatus: 'Going' | 'Interested' | null) => {
    console.log(`Updating caches for event ${eventId} with status: ${newStatus}`);
    
    // Update individual event cache
    queryClient.setQueryData(['event', eventId, user?.id], (oldData: any) => {
      if (!oldData) return oldData;
      return { ...oldData, rsvp_status: newStatus };
    });

    // Update without user ID for compatibility
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      return { ...oldData, rsvp_status: newStatus };
    });

    // Invalidate event attendees to refresh
    queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });

    console.log(`Cache update complete for event ${eventId}`);
  }, [queryClient, user?.id]);

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user?.id) {
      console.log("User not authenticated for RSVP");
      return false;
    }

    console.log(`Starting RSVP process for event ${eventId} with status ${status}`);
    setLoadingEventId(eventId);

    try {
      // Check existing RSVP
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing RSVP:', checkError);
        throw checkError;
      }

      let newStatus: 'Going' | 'Interested' | null = status;
      let actionTaken = '';

      if (existingRsvp) {
        if (existingRsvp.status === status) {
          // Toggle off - remove RSVP
          const { error: deleteError } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);

          if (deleteError) throw deleteError;
          newStatus = null;
          actionTaken = 'removed';
          console.log(`RSVP removed for event ${eventId}`);
        } else {
          // Update to new status
          const { error: updateError } = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);

          if (updateError) throw updateError;
          actionTaken = 'updated';
          console.log(`RSVP updated for event ${eventId} from ${existingRsvp.status} to ${status}`);
        }
      } else {
        // Create new RSVP
        const { error: insertError } = await supabase
          .from('event_rsvps')
          .insert([{ 
            user_id: user.id, 
            event_id: eventId, 
            status 
          }]);

        if (insertError) throw insertError;
        actionTaken = 'created';
        console.log(`New RSVP created for event ${eventId} with status ${status}`);
      }

      // Update all relevant caches immediately and synchronously
      updateEventCaches(eventId, newStatus);

      return true;
    } catch (error) {
      console.error("Error updating RSVP:", error);
      return false;
    } finally {
      setLoadingEventId(null);
    }
  }, [user?.id, updateEventCaches]);

  return {
    handleRsvp,
    loadingEventId
  };
};
