
import { useQueryClient } from '@tanstack/react-query';
import { Event } from '@/types';

/**
 * Helper hook to efficiently update all relevant caches after RSVP changes
 */
export const useCacheUpdater = () => {
  const queryClient = useQueryClient();
  
  /**
   * Updates all relevant caches after an RSVP change
   */
  const updateAllCaches = (
    eventId: string,
    userId: string,
    newStatus: 'Going' | 'Interested' | null,
    oldStatus?: string
  ) => {
    // Update events list cache
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: Event[] | undefined) => {
      if (!oldData) return oldData;
      
      return oldData.map(event => {
        if (event.id === eventId) {
          const updatedEvent = { ...event };
          
          // Update the RSVP status
          updatedEvent.rsvp_status = newStatus;
          
          // Update attendee counts
          if (!updatedEvent.attendees) {
            updatedEvent.attendees = { going: 0, interested: 0 };
          }
          
          // Adjust counts based on status changes
          if (oldStatus === 'Going' && newStatus !== 'Going') {
            updatedEvent.attendees.going = Math.max(0, (updatedEvent.attendees.going || 0) - 1);
          }
          if (oldStatus === 'Interested' && newStatus !== 'Interested') {
            updatedEvent.attendees.interested = Math.max(0, (updatedEvent.attendees.interested || 0) - 1);
          }
          if (newStatus === 'Going' && oldStatus !== 'Going') {
            updatedEvent.attendees.going = (updatedEvent.attendees.going || 0) + 1;
          }
          if (newStatus === 'Interested' && oldStatus !== 'Interested') {
            updatedEvent.attendees.interested = (updatedEvent.attendees.interested || 0) + 1;
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
      };
    });
    
    // Update event detail page cache
    queryClient.setQueryData(['eventDetail', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        rsvp_status: newStatus,
      };
    });
    
    // Invalidate relevant queries to ensure fresh data is fetched
    queryClient.invalidateQueries({ queryKey: ['events'] });
    queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    queryClient.invalidateQueries({ queryKey: ['filtered-events'] });
    queryClient.invalidateQueries({ queryKey: ['eventDetail', eventId] });
    queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
  };
  
  return { updateAllCaches };
};
