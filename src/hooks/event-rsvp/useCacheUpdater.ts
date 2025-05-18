
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Event } from '@/types';

/**
 * Hook for updating event caches after RSVP actions
 */
export const useCacheUpdater = () => {
  const queryClient = useQueryClient();
  
  // Helper function to calculate new attendee counts
  const calculateAttendeeCount = (
    event: any, 
    type: 'going' | 'interested',
    oldStatus?: string,
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

  // Update all relevant caches
  const updateAllCaches = useCallback((
    eventId: string,
    userId: string,
    newStatus: 'Going' | 'Interested' | null,
    oldStatus?: string
  ) => {
    // Update the events list cache
    queryClient.setQueriesData<Event[]>({ queryKey: ['events'] }, (oldData) => {
      if (!oldData) return oldData;
      
      return oldData.map(event => {
        if (event.id === eventId) {
          const updatedEvent = { ...event };
          
          // Update the RSVP status
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
      
      return {
        ...oldData,
        rsvp_status: newStatus,
        attendees: {
          ...(oldData.attendees || { going: 0, interested: 0 }),
          going: calculateAttendeeCount(oldData, 'going', oldStatus, newStatus),
          interested: calculateAttendeeCount(oldData, 'interested', oldStatus, newStatus)
        }
      };
    });
    
    // Also update any filtered events caches
    queryClient.setQueriesData({ queryKey: ['filtered-events'] }, (oldData: any) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      
      return oldData.map((event: Event) => {
        if (event.id === eventId) {
          const updatedEvent = { ...event };
          updatedEvent.rsvp_status = newStatus as any;
          
          // Update attendee counts if available
          if (updatedEvent.attendees) {
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
          }
          
          return updatedEvent;
        }
        return event;
      });
    });
    
    // Update user events cache if it exists
    queryClient.setQueriesData({ queryKey: ['user-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      // Handle different data shapes based on the query
      if (Array.isArray(oldData)) {
        return oldData.map((item: any) => {
          if (
            (item.event && item.event.id === eventId) || 
            (item.id === eventId)
          ) {
            return {
              ...item,
              rsvp_status: newStatus,
              status: newStatus,
            };
          }
          return item;
        });
      }
      
      return oldData;
    });
  }, [queryClient]);

  return { updateAllCaches };
};
