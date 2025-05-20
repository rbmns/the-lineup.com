
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useRsvpMutation = () => {
  const [loading, setLoading] = useState(false);
  
  /**
   * Performs the actual RSVP operation against the database
   */
  const mutateRsvp = async (
    userId: string, 
    eventId: string, 
    status: 'Going' | 'Interested'
  ): Promise<{
    success: boolean;
    newStatus: 'Going' | 'Interested' | null;
    oldStatus: 'Going' | 'Interested' | null;
  }> => {
    if (!userId) {
      return { success: false, newStatus: null, oldStatus: null };
    }
    
    setLoading(true);
    
    try {
      // Check if the user already has an RSVP for this event
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing RSVP:", checkError);
        return { success: false, newStatus: null, oldStatus: null };
      }

      // Store the old status for cache updates
      const oldStatus = existingRsvp?.status as 'Going' | 'Interested' | null;
      let newStatus: 'Going' | 'Interested' | null = null;
      
      // If clicking the same status button that's already active, toggle it off
      if (existingRsvp && existingRsvp.status === status) {
        // Delete the RSVP
        const { error: deleteError } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', existingRsvp.id);
          
        if (deleteError) {
          console.error("Error deleting RSVP:", deleteError);
          return { success: false, newStatus: null, oldStatus };
        }
        
        newStatus = null;
      } else if (existingRsvp) {
        // Update existing RSVP to new status
        const { error: updateError } = await supabase
          .from('event_rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);
          
        if (updateError) {
          console.error("Error updating RSVP:", updateError);
          return { success: false, newStatus: null, oldStatus };
        }
        
        newStatus = status;
      } else {
        // Create new RSVP
        const { error: insertError } = await supabase
          .from('event_rsvps')
          .insert({
            user_id: userId,
            event_id: eventId,
            status,
          });
          
        if (insertError) {
          console.error("Error creating RSVP:", insertError);
          return { success: false, newStatus: null, oldStatus };
        }
        
        newStatus = status;
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
      setLoading(false);
    }
  };
  
  return { mutateRsvp, loading };
};
