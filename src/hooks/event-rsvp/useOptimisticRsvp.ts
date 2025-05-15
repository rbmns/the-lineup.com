
import { useState, useCallback } from 'react';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export const useOptimisticRsvp = (userId: string | undefined) => {
  const { handleRsvp: originalHandleRsvp, loading } = useRsvpActions(userId);
  const [rsvpInProgress, setRsvpInProgress] = useState(false);
  const { savePosition } = useScrollPosition();

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId || rsvpInProgress) {
      console.log("OptimisticRsvp: User not logged in or RSVP already in progress");
      return false;
    }

    try {
      setRsvpInProgress(true);
      
      // Save current scroll position
      const scrollPosition = savePosition();
      console.log(`OptimisticRsvp - Saved scroll position: ${scrollPosition}px`);
      
      // Visual feedback animation starts
      const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
      if (eventElement) {
        const animationClass = status === 'Going' ? 'rsvp-going-animation' : 'rsvp-interested-animation';
        eventElement.classList.add(animationClass);
        setTimeout(() => {
          eventElement.classList.remove(animationClass);
        }, 400);
      }
      
      // Perform the RSVP action
      const result = await originalHandleRsvp(eventId, status);
      
      // Ensure we maintain scroll position
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 50);
      
      return result;
    } catch (error) {
      console.error("Error in optimistic RSVP handler:", error);
      return false;
    } finally {
      // Add a small delay to prevent multiple rapid RSVP clicks
      setTimeout(() => {
        setRsvpInProgress(false);
      }, 300);
    }
  }, [userId, originalHandleRsvp, savePosition]);

  return {
    handleRsvp,
    loading,
    rsvpInProgress
  };
};
