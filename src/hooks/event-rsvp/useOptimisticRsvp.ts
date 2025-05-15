
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useOptimisticRsvp = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Helper to update all relevant caches with the new RSVP status
  const updateCaches = useCallback((eventId: string, status: 'Going' | 'Interested' | null, oldStatus?: 'Going' | 'Interested' | null) => {
    // Update events in the cache
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!Array.isArray(oldData)) return oldData;
      
      return oldData.map((event: Event) => {
        if (event.id === eventId) {
          // Update the event with new RSVP status
          return {
            ...event,
            rsvp_status: status,
            // Update attendee counts
            attendees: {
              ...event.attendees,
              going: updateAttendeeCount(event.attendees?.going || 0, 'Going', oldStatus, status),
              interested: updateAttendeeCount(event.attendees?.interested || 0, 'Interested', oldStatus, status),
            }
          };
        }
        return event;
      });
    });
    
    // Update single event in the cache if it exists
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        rsvp_status: status,
        attendees: {
          ...oldData.attendees,
          going: updateAttendeeCount(oldData.attendees?.going || 0, 'Going', oldStatus, status),
          interested: updateAttendeeCount(oldData.attendees?.interested || 0, 'Interested', oldStatus, status),
        }
      };
    });
    
    // Also update user events if present
    queryClient.setQueriesData({ queryKey: ['user-events'] }, (oldData: any) => {
      if (!Array.isArray(oldData)) return oldData;
      
      // Map through any user events and update those with matching eventId
      return oldData.map((item: any) => {
        // Handle different formats of user events data
        const eventToUpdate = item.event || item;
        
        if (eventToUpdate.id === eventId) {
          return {
            ...item,
            rsvp_status: status,
            event: item.event ? {
              ...item.event,
              rsvp_status: status
            } : undefined
          };
        }
        return item;
      });
    });
  }, [queryClient]);
  
  // Helper function to calculate new attendee counts
  const updateAttendeeCount = (
    currentCount: number,
    countType: 'Going' | 'Interested',
    oldStatus?: 'Going' | 'Interested' | null,
    newStatus?: 'Going' | 'Interested' | null
  ): number => {
    let count = currentCount;
    
    // Remove from old count if needed
    if (oldStatus === countType && newStatus !== countType) {
      count = Math.max(0, count - 1);
    }
    
    // Add to new count if needed
    if (oldStatus !== countType && newStatus === countType) {
      count += 1;
    }
    
    return count;
  };

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) return false;
    setLoading(true);

    try {
      console.log(`OptimisticRsvp: Processing RSVP for event ${eventId} with status ${status}`);
      
      // Check current RSVP status first
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      // Store the old status for cache updates
      const oldStatus = existingRsvp?.status as 'Going' | 'Interested' | null;
      
      // Determine if we're toggling or changing status
      let newStatus: 'Going' | 'Interested' | null = status;
      if (oldStatus === status) {
        // If clicking the same status, remove it (toggle off)
        newStatus = null;
      }

      // Update UI optimistically before the network request completes
      updateCaches(eventId, newStatus, oldStatus);
      
      // Perform the actual database update
      if (existingRsvp && newStatus === null) {
        // Delete the RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', existingRsvp.id);

        if (error) throw error;
      } else if (existingRsvp) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .update({ status: newStatus })
          .eq('id', existingRsvp.id);

        if (error) throw error;
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert([{ event_id: eventId, user_id: userId, status }]);

        if (error) throw error;
      }

      // No toast needed - we're using optimistic UI updates
      console.log(`OptimisticRsvp: Successfully processed RSVP`);
      return true;
    } catch (error) {
      console.error('OptimisticRsvp error:', error);
      
      // Revert the optimistic update in the cache
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, updateCaches, queryClient]);

  return {
    handleRsvp,
    loading
  };
};
