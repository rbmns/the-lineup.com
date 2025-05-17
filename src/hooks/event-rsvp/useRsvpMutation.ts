
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook for making RSVP mutations to the database
 */
export const useRsvpMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutateRsvp = useCallback(async (
    userId: string,
    eventId: string,
    status: 'Going' | 'Interested'
  ) => {
    if (!userId || !eventId) {
      return { success: false, newStatus: null, oldStatus: null };
    }

    setIsLoading(true);
    
    try {
      console.log(`RSVP mutation: User ${userId}, Event ${eventId}, Status ${status}`);
      
      // Check for existing RSVP
      const { data: existingRsvp, error: fetchError } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Error checking existing RSVP:", fetchError);
        return { success: false, newStatus: null, oldStatus: null };
      }
      
      const oldStatus = existingRsvp?.status;
      let newStatus = status;
      
      // If clicking the same status button that's already active, toggle it off
      if (existingRsvp && existingRsvp.status === status) {
        console.log("Toggling off RSVP (same status clicked)");
        const { error } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', existingRsvp.id);
          
        if (error) {
          console.error("Error deleting RSVP:", error);
          return { success: false, newStatus: null, oldStatus };
        }
        
        newStatus = null;
      } else if (existingRsvp) {
        // Update existing RSVP to new status
        console.log("Updating RSVP status to:", status);
        const { error } = await supabase
          .from('event_rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);
          
        if (error) {
          console.error("Error updating RSVP:", error);
          return { success: false, newStatus: null, oldStatus };
        }
      } else {
        // Create new RSVP
        console.log("Creating new RSVP with status:", status);
        const { error } = await supabase
          .from('event_rsvps')
          .insert({
            user_id: userId,
            event_id: eventId,
            status,
          });
          
        if (error) {
          console.error("Error creating RSVP:", error);
          return { success: false, newStatus: null, oldStatus };
        }
      }
      
      return { 
        success: true,
        newStatus,
        oldStatus
      };
    } catch (error) {
      console.error("Error in RSVP mutation:", error);
      return { success: false, newStatus: null, oldStatus: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    mutateRsvp,
    isLoading
  };
};
