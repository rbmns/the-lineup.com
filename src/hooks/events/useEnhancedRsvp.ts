
import { useState, useCallback, useRef } from 'react';
import { useStableRsvpActions } from '@/hooks/event-rsvp/useStableRsvpActions';
import { toast } from '@/components/ui/use-toast';

/**
 * Enhanced RSVP handler that provides immediate UI feedback and scroll preservation
 */
export const useEnhancedRsvp = (userId: string | undefined) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { handleRsvp: rsvpAction, loading: stableRsvpLoading } = useStableRsvpActions(userId);
  const rsvpInProgressRef = useRef(false);

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      toast({
        description: "Please sign in to RSVP to events",
        variant: "destructive",
      });
      return false;
    }

    if (rsvpInProgressRef.current && loadingEventId === eventId) {
      // Already processing this event
      return false;
    }

    const scrollPosition = window.scrollY;
    rsvpInProgressRef.current = true;
    setLoadingEventId(eventId);
    console.log(`EnhancedRsvp: Processing RSVP for event ${eventId} with status ${status}`);

    try {
      // Add visual feedback animation to the event card
      const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
      if (eventCard) {
        const animationClass = status === 'Going' ? 'rsvp-going-animation' : 'rsvp-interested-animation';
        eventCard.classList.add(animationClass);
        setTimeout(() => eventCard.classList.remove(animationClass), 800);
      }
      
      // Handle the RSVP with optimistic UI updates
      const result = await rsvpAction(eventId, status);
      
      // Restore scroll position after the RSVP operation
      // Use a timeout to allow React to re-render if necessary before scrolling
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto' // Use 'auto' for instant scroll, 'smooth' if animation desired
        });
      }, 100); // Small delay

      return result;
    } catch (error) {
      console.error('Error in enhanced RSVP handler:', error);
      toast({
        title: "RSVP Failed",
        description: "Could not update your RSVP. Please try again.",
        variant: "destructive",
      });
      // If error, restore scroll immediately as well
      window.scrollTo({ top: scrollPosition, behavior: 'auto' });
      return false;
    } finally {
      // Clear loading state after a short delay
      setTimeout(() => {
        setLoadingEventId(null);
        rsvpInProgressRef.current = false;
      }, 300); // Ensure this delay is longer than the scroll restoration timeout
    }
  }, [userId, rsvpAction, loadingEventId]); // Added loadingEventId to dependencies

  return {
    handleRsvp,
    loading: stableRsvpLoading, // This reflects the underlying StableRsvpActions loading
    loadingEventId, // This is for per-event UI feedback
    rsvpInProgressRef, // Pass this if other components need to know about ongoing RSVP
  };
};
