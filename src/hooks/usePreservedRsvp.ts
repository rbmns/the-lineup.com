
import { useState } from 'react';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export const usePreservedRsvp = (userId: string | undefined) => {
  const { handleRsvp: originalHandleRsvp } = useRsvpActions();
  const { savePosition, restorePosition } = useScrollPosition();
  const [rsvpInProgress, setRsvpInProgress] = useState(false);

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId || rsvpInProgress) {
      console.log("RSVP operation skipped: user not logged in or operation in progress");
      return false;
    }

    try {
      setRsvpInProgress(true);
      
      // Save current scroll position
      const scrollPosition = savePosition();
      console.log(`PreservedRsvp - Saved scroll position: ${scrollPosition}px`);
      
      // Visual feedback animation starts
      const animatedElement = document.querySelector(`[data-event-id="${eventId}"]`);
      if (animatedElement) {
        animatedElement.classList.add('animate-pulse');
      }
      
      // Perform the RSVP action
      const result = await originalHandleRsvp(eventId, status);
      
      // Restore scroll position
      restorePosition(scrollPosition);
      
      // Extra scroll restoration for reliability
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
        
        // Remove animation
        if (animatedElement) {
          animatedElement.classList.remove('animate-pulse');
        }
      }, 200);
      
      return result;
    } catch (error) {
      console.error("Error in preserved RSVP handler:", error);
      return false;
    } finally {
      // Add a delay to prevent multiple rapid RSVP clicks
      setTimeout(() => {
        setRsvpInProgress(false);
      }, 300);
    }
  };

  return {
    handleRsvp,
    loading: false,
    rsvpInProgress
  };
};
