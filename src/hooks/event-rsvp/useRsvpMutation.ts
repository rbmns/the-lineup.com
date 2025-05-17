
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook for performing RSVP mutations with Supabase
 */
export const useRsvpMutation = () => {
  const mutateRsvp = useCallback(async (
    userId: string, 
    eventId: string, 
    status: 'Going' | 'Interested'
  ) => {
    // Store position before DB operations
    const scrollPosition = window.scrollY;
    console.log(`useRsvpMutation - Saving scroll position: ${scrollPosition}px`);
    
    try {
      // Get the current RSVP status
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();

      if (checkError) throw checkError;

      const oldStatus = existingRsvp?.status as 'Going' | 'Interested' | undefined;
      let newStatus: 'Going' | 'Interested' | null = status;
      
      // Toggle behavior
      if (oldStatus === status) {
        newStatus = null;
      }

      let success = false;
      
      // Update the database
      if (existingRsvp && newStatus === null) {
        // Delete the RSVP (toggle off)
        const { error } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', existingRsvp.id);
          
        if (error) throw error;
        success = true;
        
      } else if (existingRsvp) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .update({ status: newStatus })
          .eq('id', existingRsvp.id);
          
        if (error) throw error;
        success = true;
        
      } else if (newStatus) {
        // Create new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert({
            user_id: userId,
            event_id: eventId,
            status: newStatus
          });
          
        if (error) throw error;
        success = true;
      }
      
      // Try to restore the scroll position
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 50);

      return {
        success,
        newStatus,
        oldStatus,
        toastMessage: '' // Empty toast message
      };
      
    } catch (error) {
      console.error('RSVP mutation failed:', error);
      
      // Even on error, try to restore scroll position
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 50);
      
      return {
        success: false,
        newStatus: null,
        oldStatus: null,
        toastMessage: ''
      };
    }
  }, []);

  return { mutateRsvp };
};
