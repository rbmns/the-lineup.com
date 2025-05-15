
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook that provides stable RSVP actions with Supabase updates
 */
export const useStableRsvpActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      console.log("User not logged in");
      return false;
    }

    console.log(`StableRsvp: User ${userId}, Event ${eventId}, Status ${status}`);
    setLoading(true);
    
    try {
      // Check existing RSVP - explicitly use await to ensure we get the data before proceeding
      const checkResult = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
        
      if (checkResult.error) {
        console.error("Error checking existing RSVP:", checkResult.error);
        throw checkResult.error;
      }
        
      const existingRsvp = checkResult.data;
      console.log("Existing RSVP:", existingRsvp);

      let newRsvpStatus: 'Going' | 'Interested' | null = null;
      
      // If clicking the same status button that's already active, toggle it off
      if (existingRsvp && existingRsvp.status === status) {
        // Toggle off - delete the RSVP if clicking the same status
        console.log("Deleting RSVP (toggle off)");
        const deleteResult = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', existingRsvp.id);
          
        if (deleteResult.error) {
          console.error("Error deleting RSVP:", deleteResult.error);
          throw deleteResult.error;
        }
        
        newRsvpStatus = null;
      } else if (existingRsvp) {
        // Update existing RSVP to new status
        console.log("Updating RSVP status to:", status);
        const updateResult = await supabase
          .from('event_rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);
          
        if (updateResult.error) {
          console.error("Error updating RSVP:", updateResult.error);
          throw updateResult.error;
        }
        
        newRsvpStatus = status;
      } else {
        // Create new RSVP
        console.log("Creating new RSVP with status:", status);
        const insertResult = await supabase
          .from('event_rsvps')
          .insert({
            user_id: userId,
            event_id: eventId,
            status,
          });
          
        if (insertResult.error) {
          console.error("Error creating RSVP:", insertResult.error);
          throw insertResult.error;
        }
        
        newRsvpStatus = status;
      }

      // Invalidate queries to refresh data - this ensures all UI components receive updated data
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      
      console.log(`StableRsvp: Successfully ${newRsvpStatus ? 'updated' : 'removed'} RSVP`);
      
      return true;
    } catch (error) {
      console.error("Error in StableRsvpActions:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, queryClient]);

  return {
    handleRsvp,
    loading
  };
};
