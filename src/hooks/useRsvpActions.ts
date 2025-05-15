import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useScrollPosition } from './useScrollPosition';
import { toast } from '@/hooks/use-toast';

export const useRsvpActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { savePosition, restorePosition } = useScrollPosition();

  const handleRsvp = async (eventId: string, status: 'Interested' | 'Going') => {
    if (!userId) {
      toast("Please log in to RSVP to events");
      return false;
    }

    console.log(`Handling RSVP: User ${userId}, Event ${eventId}, Status ${status}`);
    setLoading(true);
    
    try {
      // Save current scroll position
      const scrollPosition = savePosition();
      console.log(`RSVP action - Saved scroll position: ${scrollPosition}px`);
      
      // Check existing RSVP
      const { data: existingRsvp, error: fetchError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking existing RSVP:", fetchError);
        throw fetchError;
      }

      console.log("Existing RSVP:", existingRsvp);

      let newRsvpStatus: 'Going' | 'Interested' | null = null;
      let oldStatus = existingRsvp?.status;
      
      // If clicking the same status button that's already active, toggle it off
      if (existingRsvp && existingRsvp.status === status) {
        // Toggle off - delete the RSVP if clicking the same status
        console.log("Deleting RSVP (toggle off)");
        const { error: deleteError } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', existingRsvp.id);

        if (deleteError) {
          console.error("Error deleting RSVP:", deleteError);
          throw deleteError;
        }
        
        newRsvpStatus = null;
        toast(`RSVP removed`);
      } else if (existingRsvp) {
        // Update existing RSVP to new status
        console.log("Updating RSVP status to:", status);
        const { error: updateError } = await supabase
          .from('event_rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);

        if (updateError) {
          console.error("Error updating RSVP:", updateError);
          throw updateError;
        }
        
        newRsvpStatus = status;
        toast(`RSVP updated to ${status}`);
      } else {
        // Create new RSVP
        console.log("Creating new RSVP with status:", status);
        const { error: insertError } = await supabase
          .from('event_rsvps')
          .insert({
            user_id: userId,
            event_id: eventId,
            status,
          });

        if (insertError) {
          console.error("Error creating RSVP:", insertError);
          throw insertError;
        }
        
        newRsvpStatus = status;
        toast(`RSVP added: ${status}`);
      }
      
      // Update the cache
      updateAllCaches(eventId, userId, newRsvpStatus, oldStatus);
      
      // Restore scroll position
      restorePosition(scrollPosition);
      
      // Backup scroll restoration
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 50);
      
      return true;
    } catch (error) {
      console.error("Error RSVPing to event:", error);
      toast("Failed to update RSVP status");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update all relevant caches
  const updateAllCaches = (
    eventId: string,
    userId: string,
    newStatus: 'Going' | 'Interested' | null,
    oldStatus?: string
  ) => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['events'] });
    queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
    queryClient.invalidateQueries({ queryKey: ['user-events'] });
  };

  return {
    handleRsvp,
    loading
  };
};
