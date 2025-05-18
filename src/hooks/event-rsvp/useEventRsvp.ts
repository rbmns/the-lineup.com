
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * A unified hook for handling event RSVPs with immediate UI feedback
 */
export const useEventRsvp = (userId: string | undefined) => {
  const [isRsvpLoading, setIsRsvpLoading] = useState(false);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleRsvp = useCallback(async (
    eventId: string, 
    status: 'Going' | 'Interested'
  ): Promise<boolean> => {
    if (!userId) {
      console.log('User not logged in, cannot RSVP');
      return false;
    }

    // Store event ID for optimistic updates
    setLastEventId(eventId);
    setIsRsvpLoading(true);
    
    try {
      // Prepare optimistic update for query cache
      queryClient.setQueryData(
        ['event', eventId], 
        (oldData: any) => {
          if (!oldData) return oldData;
          
          // Calculate new status based on current status
          const currentStatus = oldData.rsvp_status;
          const newStatus = currentStatus === status ? null : status;
          
          return {
            ...oldData,
            rsvp_status: newStatus
          };
        }
      );
      
      // Prepare optimistic update for events list
      queryClient.setQueryData(
        ['events'], 
        (oldData: any[]) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          
          return oldData.map(event => {
            if (event.id === eventId) {
              const currentStatus = event.rsvp_status;
              const newStatus = currentStatus === status ? null : status;
              
              return {
                ...event,
                rsvp_status: newStatus
              };
            }
            return event;
          });
        }
      );
      
      // Make API call here with your fetch/supabase call
      // For now we'll just simulate a successful response
      // This should be replaced with actual API call
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // After API call, invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      return true;
    } catch (error) {
      console.error('RSVP action failed:', error);
      return false;
    } finally {
      setIsRsvpLoading(false);
    }
  }, [userId, queryClient]);

  return {
    handleRsvp,
    isRsvpLoading,
    lastEventId
  };
};
