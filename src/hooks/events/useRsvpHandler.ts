
import { useCallback, MutableRefObject } from 'react';

export const useRsvpHandler = (
  user: any,
  handleRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>,
  rsvpInProgressRef: MutableRefObject<boolean>
) => {
  const handleEventRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user) {
      console.log("User not logged in, cannot RSVP");
      return false;
    }
    
    try {
      // Mark that we're in an RSVP action to prevent scroll changes
      if (rsvpInProgressRef) {
        rsvpInProgressRef.current = true;
      }
      
      // Store scroll position for restoration
      const scrollPosition = window.scrollY;
      
      // Add visual feedback to the specific event card
      const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
      if (eventCard) {
        const animationClass = status === 'Going' ? 'rsvp-going-animation' : 'rsvp-interested-animation';
        eventCard.classList.add(animationClass);
        setTimeout(() => eventCard.classList.remove(animationClass), 800);
      }
      
      // Use our RSVP handler
      const result = await handleRsvp(eventId, status);
      
      // Restore scroll position after the RSVP operation
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 100);
      
      return result;
    } catch (error) {
      console.error("Error in EventsPage RSVP handler:", error);
      return false;
    } finally {
      // Wait a moment before allowing scroll position saves again
      setTimeout(() => {
        if (rsvpInProgressRef) {
          rsvpInProgressRef.current = false;
        }
      }, 500);
    }
  }, [user, handleRsvp, rsvpInProgressRef]);

  return { handleEventRsvp };
};
