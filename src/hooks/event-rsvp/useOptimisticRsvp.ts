
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Event } from '@/types';

/**
 * Hook that provides optimistic RSVP actions using React Query's cache
 */
export const useOptimisticRsvp = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const isProcessingRef = useRef(false);
  const toastShownRef = useRef(false);

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    // Prevent concurrent RSVP operations
    if (isProcessingRef.current) {
      console.log("Already processing an RSVP request, ignoring");
      return false;
    }

    if (!userId) {
      // Only show toast once per session to avoid spamming
      if (!toastShownRef.current) {
        toast("Please log in to RSVP to events");
        toastShownRef.current = true;
        // Reset after 5 seconds
        setTimeout(() => { toastShownRef.current = false }, 5000);
      }
      return false;
    }

    console.log(`OptimisticRsvp: Starting - User ${userId}, Event ${eventId}, Status ${status}`);
    
    try {
      isProcessingRef.current = true;
      
      // Store current scroll position right at the beginning
      const scrollPosition = window.scrollY;
      
      // Capture existing cache state for potential rollback
      const previousEventsData = queryClient.getQueryData<Event[]>(['events', userId]);
      const previousEventData = queryClient.getQueryData<Event>(['event', eventId]);
      
      // Get current RSVP status for optimistic update
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing RSVP:", checkError);
        throw checkError;
      }
      
      const oldStatus = existingRsvp?.status as 'Going' | 'Interested' | undefined;
      console.log("Current RSVP status:", oldStatus);
      
      // Calculate what the new status will be
      let newRsvpStatus: 'Going' | 'Interested' | null = status;
      
      // Toggle behavior - if same status is clicked, it will turn off
      if (oldStatus === status) {
        newRsvpStatus = null;
        console.log("Toggling off RSVP status");
      }
      
      // Perform optimistic UI updates
      setLoading(true);
      
      // Update events cache (main events list) - careful not to trigger re-renders
      queryClient.setQueriesData<Event[]>({ queryKey: ['events'] }, (oldData) => {
        if (!oldData) return oldData;
        
        return oldData.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              rsvp_status: newRsvpStatus || undefined,
              attendees: {
                going: calculateAttendeeCount(event, 'going', oldStatus, newRsvpStatus),
                interested: calculateAttendeeCount(event, 'interested', oldStatus, newRsvpStatus)
              }
            };
          }
          return event;
        });
      });
      
      // Update individual event cache if it exists
      queryClient.setQueriesData<Event>({ queryKey: ['event', eventId] }, (oldData) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          rsvp_status: newRsvpStatus || undefined,
          attendees: {
            going: calculateAttendeeCount(oldData, 'going', oldStatus, newRsvpStatus),
            interested: calculateAttendeeCount(oldData, 'interested', oldStatus, newRsvpStatus)
          }
        };
      });
      
      // Create a promise to track the save operation
      const savePromise = (async () => {
        try {
          // Perform the database operation
          console.log("Updating database in background...");
          
          if (existingRsvp && newRsvpStatus === null) {
            // Delete the RSVP if toggling off
            console.log("Deleting RSVP (toggle off)");
            const { error: deleteError } = await supabase
              .from('event_rsvps')
              .delete()
              .eq('id', existingRsvp.id);
              
            if (deleteError) {
              console.error("Error deleting RSVP:", deleteError);
              throw deleteError;
            }
          } else if (existingRsvp) {
            // Update existing RSVP
            console.log("Updating RSVP to:", newRsvpStatus);
            const { error: updateError } = await supabase
              .from('event_rsvps')
              .update({ status: newRsvpStatus })
              .eq('id', existingRsvp.id);
              
            if (updateError) {
              console.error("Error updating RSVP:", updateError);
              throw updateError;
            }
          } else if (newRsvpStatus) {
            // Create new RSVP
            console.log("Creating new RSVP with status:", newRsvpStatus);
            const { error: insertError } = await supabase
              .from('event_rsvps')
              .insert({
                user_id: userId,
                event_id: eventId,
                status: newRsvpStatus
              });
              
            if (insertError) {
              console.error("Error creating RSVP:", insertError);
              throw insertError;
            }
          }
          
          // Limited toast notification to prevent disruptive UX
          if (!toastShownRef.current) {
            const action = newRsvpStatus === null ? "Removed" : 
                          newRsvpStatus === "Going" ? "Going to" : "Interested in";
            toast(`${action} event`, {
              duration: 1500,
            });
            
            // Limit toast frequency
            toastShownRef.current = true;
            setTimeout(() => { toastShownRef.current = false }, 3000);
          }
          
          console.log("Database update completed successfully");
          return true;
        } catch (error) {
          console.error("Database operation failed:", error);
          return false;
        }
      })();
      
      // Wait for the save promise to complete
      const result = await savePromise;
      
      if (!result) {
        throw new Error("Database operation failed");
      }
      
      // Restore scroll position
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 10);
      
      console.log(`OptimisticRsvp: Completed successfully for event ${eventId}`);
      return true;
    } catch (error) {
      console.error("Error in OptimisticRsvp:", error);
      
      // Store the variables in this scope for rollback
      const previousEventsData = queryClient.getQueryData<Event[]>(['events', userId]);
      const previousEventData = queryClient.getQueryData<Event>(['event', eventId]);
      
      // Revert optimistic updates if there was an error
      if (previousEventsData) {
        queryClient.setQueryData(['events', userId], previousEventsData);
      }
      
      if (previousEventData) {
        queryClient.setQueryData(['event', eventId], previousEventData);
      }
      
      // Limit toast frequency
      if (!toastShownRef.current) {
        toast("Failed to update RSVP status");
        toastShownRef.current = true;
        setTimeout(() => { toastShownRef.current = false }, 3000);
      }
      return false;
    } finally {
      setLoading(false);
      
      // Reset processing flag after a small delay
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 300);
    }
  }, [userId, queryClient]);

  // Helper function to calculate new attendee counts
  const calculateAttendeeCount = (
    event: Event, 
    type: 'going' | 'interested',
    oldStatus?: 'Going' | 'Interested',
    newStatus?: 'Going' | 'Interested' | null
  ) => {
    const currentCount = event.attendees?.[type] || 0;
    
    if (oldStatus === capitalizeFirst(type) && newStatus !== capitalizeFirst(type)) {
      return Math.max(0, currentCount - 1);
    }
    
    if (newStatus === capitalizeFirst(type) && oldStatus !== capitalizeFirst(type)) {
      return currentCount + 1;
    }
    
    return currentCount;
  };
  
  // Helper to capitalize first letter
  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return {
    handleRsvp,
    loading
  };
};
