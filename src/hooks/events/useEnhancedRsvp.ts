
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useEventRefetch } from '@/hooks/events/useEventRefetch';

export const useEnhancedRsvp = (userId?: string) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { refetchEvents } = useEventRefetch();
  
  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      toast.error('Please log in to RSVP for events');
      return false;
    }
    
    try {
      setLoadingEventId(eventId);
      
      // Check if an RSVP already exists for this event and user
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing RSVP:', checkError);
        toast.error('Failed to update your RSVP');
        return false;
      }
      
      let result;
      
      if (existingRsvp) {
        if (existingRsvp.status === status) {
          // If clicking same status, remove RSVP
          result = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);
            
          if (result.error) throw result.error;
          toast.success(`RSVP removed`);
        } else {
          // Update to new status
          result = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);
            
          if (result.error) throw result.error;
          toast.success(`You're ${status.toLowerCase()} to this event`);
        }
      } else {
        // Create new RSVP
        result = await supabase
          .from('event_rsvps')
          .insert({
            event_id: eventId,
            user_id: userId,
            status
          });
          
        if (result.error) throw result.error;
        toast.success(`You're ${status.toLowerCase()} to this event`);
      }
      
      // Refetch events to update UI
      refetchEvents();
      return true;
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update your RSVP');
      return false;
    } finally {
      setLoadingEventId(null);
    }
  };
  
  return { handleRsvp, loadingEventId };
};
