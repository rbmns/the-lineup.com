
import { useState } from 'react';
import { useRsvpMutation } from '../event-rsvp/useRsvpMutation';
import { useScrollPosition } from '../useScrollPosition';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * A unified hook for handling event RSVPs with scroll preservation and optimistic updates
 */
export const useEventRsvpHandler = ({
  userId,
  refetchEvents
}: {
  userId: string | undefined;
  refetchEvents?: () => void;
}) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { mutateRsvp } = useRsvpMutation();
  const { savePosition, restorePosition } = useScrollPosition();
  const queryClient = useQueryClient();

  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!userId) {
      toast.error("Please log in to RSVP");
      return false;
    }

    // Save scroll position before any operations
    const scrollPos = savePosition();
    console.log(`RSVP handler saving scroll position: ${scrollPos}px`);
    
    try {
      // Set loading state for this specific event
      setLoadingEventId(eventId);
      
      // Perform the RSVP mutation
      const result = await mutateRsvp(userId, eventId, status);
      
      if (result.success) {
        // Show success toast if configured
        if (result.toastMessage) {
          toast.success(result.toastMessage);
        }
        
        // Invalidate relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        queryClient.invalidateQueries({ queryKey: ['user-events'] });
        
        // Refetch events if a refetch function was provided
        if (refetchEvents) {
          refetchEvents();
        }
        
        return true;
      } else {
        toast.error("Failed to update RSVP status");
        return false;
      }
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      toast.error("An error occurred while updating your RSVP");
      return false;
    } finally {
      // Clear loading state
      setLoadingEventId(null);
      
      // Restore scroll position with multiple approaches for reliability
      setTimeout(() => {
        restorePosition(scrollPos);
        
        // Additional timeout for extra reliability
        setTimeout(() => {
          window.scrollTo({
            top: scrollPos,
            behavior: 'auto'
          });
        }, 50);
      }, 0);
    }
  };

  return {
    handleEventRsvp,
    loadingEventId
  };
};
