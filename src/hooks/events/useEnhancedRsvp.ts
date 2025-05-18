
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useEnhancedRsvp = (userId: string | undefined) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  
  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      return false;
    }
    
    setLoadingEventId(eventId);
    
    try {
      // Get current status
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // Whether to add, update, or delete based on current status
      if (existingRsvp && existingRsvp.status === status) {
        // If clicking the same status, remove the RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', existingRsvp.id);
          
        if (error) throw error;
      } else if (existingRsvp) {
        // Update existing RSVP to new status
        const { error } = await supabase
          .from('event_rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);
          
        if (error) throw error;
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert({
            user_id: userId,
            event_id: eventId,
            status
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in enhanced RSVP handler:', error);
      return false;
    } finally {
      // Small delay to allow animations to complete
      setTimeout(() => {
        setLoadingEventId(null);
      }, 300);
    }
  }, [userId]);

  return {
    handleRsvp,
    loadingEventId
  };
};
