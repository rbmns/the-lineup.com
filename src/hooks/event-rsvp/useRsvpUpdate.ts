
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Event } from '@/types';

export const useRsvpUpdate = () => {
  const queryClient = useQueryClient();

  const updateRSVP = useCallback(async (
    userId: string,
    eventId: string,
    status: 'Going' | 'Interested' | null
  ) => {
    if (!userId || !eventId) return false;
    
    try {
      console.log(`Updating RSVP: userId=${userId}, eventId=${eventId}, status=${status}`);
      
      // Check for existing RSVP
      const { data: existingRsvp, error: fetchError } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      console.log('Existing RSVP:', existingRsvp);
      
      let oldStatus = existingRsvp?.status;
      
      if (status === null) {
        // Remove RSVP if status is null
        if (existingRsvp) {
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);
          
          if (error) throw error;
        }
      } else if (existingRsvp) {
        // Update existing RSVP
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
      
      // Update all cache entries that might contain this event
      updateEventsCaches(eventId, userId, status, oldStatus);
      
      // Only invalidate the attendees query which needs fresh data
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
      
      return true;
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast({
        title: "RSVP update failed",
        description: "Could not update your RSVP. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [queryClient]);

  // Helper function to update all relevant caches
  const updateEventsCaches = (
    eventId: string, 
    userId: string, 
    newStatus: 'Going' | 'Interested' | null,
    oldStatus?: string
  ) => {
    // Update events cache
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      return oldData.map((event: Event) => {
        if (event.id === eventId) {
          // Copy the event to avoid mutating the cache directly
          const updatedEvent = { ...event };
          
          // Update RSVP status
          updatedEvent.rsvp_status = newStatus as any;
          
          // Update attendee counts
          if (!updatedEvent.attendees) {
            updatedEvent.attendees = { going: 0, interested: 0 };
          }
          
          // Adjust counts based on status changes
          if (oldStatus === 'Going' && newStatus !== 'Going') {
            updatedEvent.attendees.going = Math.max(0, updatedEvent.attendees.going - 1);
          }
          if (oldStatus === 'Interested' && newStatus !== 'Interested') {
            updatedEvent.attendees.interested = Math.max(0, updatedEvent.attendees.interested - 1);
          }
          if (newStatus === 'Going' && oldStatus !== 'Going') {
            updatedEvent.attendees.going += 1;
          }
          if (newStatus === 'Interested' && oldStatus !== 'Interested') {
            updatedEvent.attendees.interested += 1;
          }
          
          return updatedEvent;
        }
        return event;
      });
    });
    
    // Update specific event cache
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      
      const updatedEvent = { ...oldData };
      
      // Update RSVP status
      updatedEvent.rsvp_status = newStatus as any;
      
      // Update attendee counts
      if (!updatedEvent.attendees) {
        updatedEvent.attendees = { going: 0, interested: 0 };
      }
      
      // Adjust counts based on status changes
      if (oldStatus === 'Going' && newStatus !== 'Going') {
        updatedEvent.attendees.going = Math.max(0, updatedEvent.attendees.going - 1);
      }
      if (oldStatus === 'Interested' && newStatus !== 'Interested') {
        updatedEvent.attendees.interested = Math.max(0, updatedEvent.attendees.interested - 1);
      }
      if (newStatus === 'Going' && oldStatus !== 'Going') {
        updatedEvent.attendees.going += 1;
      }
      if (newStatus === 'Interested' && oldStatus !== 'Interested') {
        updatedEvent.attendees.interested += 1;
      }
      
      return updatedEvent;
    });
    
    // Update user-events cache
    queryClient.setQueriesData({ queryKey: ['user-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      return oldData.map((item: any) => {
        if (item.event && item.event.id === eventId) {
          return {
            ...item,
            status: newStatus,
          };
        }
        return item;
      });
    });
    
    // Update filtered events cache entries
    // Format: [events, userId, eventTypesFilter, venuesFilter, etc]
    queryClient.getQueriesData({ queryKey: ['events'] }).forEach(([queryKey, _]) => {
      if (Array.isArray(queryKey) && queryKey[0] === 'events' && queryKey.length > 2) {
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          
          return oldData.map((event: Event) => {
            if (event.id === eventId) {
              const updatedEvent = { ...event };
              updatedEvent.rsvp_status = newStatus as any;
              
              if (!updatedEvent.attendees) {
                updatedEvent.attendees = { going: 0, interested: 0 };
              }
              
              if (oldStatus === 'Going' && newStatus !== 'Going') {
                updatedEvent.attendees.going = Math.max(0, updatedEvent.attendees.going - 1);
              }
              if (oldStatus === 'Interested' && newStatus !== 'Interested') {
                updatedEvent.attendees.interested = Math.max(0, updatedEvent.attendees.interested - 1);
              }
              if (newStatus === 'Going' && oldStatus !== 'Going') {
                updatedEvent.attendees.going += 1;
              }
              if (newStatus === 'Interested' && oldStatus !== 'Interested') {
                updatedEvent.attendees.interested += 1;
              }
              
              return updatedEvent;
            }
            return event;
          });
        });
      }
    });
  };

  return {
    updateRSVP
  };
};
