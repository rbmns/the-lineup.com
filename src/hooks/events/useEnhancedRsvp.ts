
import { useState, useCallback } from 'react';
import { useStableRsvpActions } from '@/hooks/event-rsvp/useStableRsvpActions';
import { toast } from '@/components/ui/use-toast';

/**
 * Enhanced RSVP handler that provides immediate UI feedback
 */
export const useEnhancedRsvp = (userId: string | undefined) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { handleRsvp: rsvpAction, loading } = useStableRsvpActions(userId);

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      toast({
        description: "Please sign in to RSVP to events"
      });
      return false;
    }

    try {
      // Set local loading state for this specific event
      setLoadingEventId(eventId);
      console.log(`EnhancedRsvp: Processing RSVP for event ${eventId} with status ${status}`);

      // Add visual feedback animation to the event card
      const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
      if (eventCard) {
        const animationClass = status === 'Going' ? 'rsvp-going-animation' : 'rsvp-interested-animation';
        eventCard.classList.add(animationClass);
        setTimeout(() => eventCard.classList.remove(animationClass), 800);
      }
      
      // Handle the RSVP with optimistic UI updates
      const result = await rsvpAction(eventId, status);
      return result;
    } catch (error) {
      console.error('Error in enhanced RSVP handler:', error);
      return false;
    } finally {
      // Clear loading state after a short delay
      setTimeout(() => {
        setLoadingEventId(null);
      }, 300);
    }
  }, [userId, rsvpAction]);

  return {
    handleRsvp,
    loading,
    loadingEventId
  };
};
