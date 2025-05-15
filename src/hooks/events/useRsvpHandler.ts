
import { useCallback, RefObject, MutableRefObject } from 'react';
import { toast } from 'sonner';

export const useRsvpHandler = (
  user: any,
  handleRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>,
  rsvpInProgressRef: MutableRefObject<boolean>
) => {
  const handleEventRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user) {
      toast.error("Please log in to RSVP to events");
      return false;
    }
    
    try {
      console.log(`EventsPage - RSVP handler called for event: ${eventId}, status: ${status}`);
      
      // Mark that we're in an RSVP action to prevent scroll changes
      if (rsvpInProgressRef) {
        rsvpInProgressRef.current = true;
      }
      
      // Store current scroll position
      const scrollPosition = window.scrollY;
      
      // Add visual feedback to the specific event card
      const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
      if (eventCard) {
        eventCard.classList.add('animate-pulse');
      }
      
      // Use our preserved RSVP handler
      const result = await handleRsvp(eventId, status);
      console.log(`EventsPage - RSVP result:`, result);
      
      // Restore scroll position after the RSVP operation
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
        
        // Remove animation
        if (eventCard) {
          eventCard.classList.remove('animate-pulse');
        }
      }, 100);
      
      return result;
    } catch (error) {
      console.error("Error in EventsPage RSVP handler:", error);
      toast.error("Failed to update RSVP");
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
