
import { useCallback } from 'react';
import { useStableRsvpActions } from './useStableRsvpActions';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { toast } from 'sonner';

/**
 * Enhanced hook that combines stable RSVP actions with scroll preservation
 */
export const useEnhancedRsvpWithScrollPreservation = (userId: string | undefined) => {
  const { handleRsvp: baseHandleRsvp, loading } = useStableRsvpActions(userId);
  const { savePosition, restorePosition } = useScrollPosition();

  // Enhanced RSVP handler with scroll protection
  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    console.log(`Enhanced RSVP: Starting RSVP action for event ${eventId} with status ${status}`);
    
    if (!userId) {
      toast.error("Please log in to RSVP");
      return false;
    }
    
    // Save scroll position immediately
    const position = savePosition();
    console.log(`Enhanced RSVP - Saved position: ${position}px`);
    
    try {
      // Prevent default form submission behavior
      document.body.classList.add('rsvp-in-progress');
      
      // Call the base RSVP handler
      const success = await baseHandleRsvp(eventId, status);
      console.log(`Enhanced RSVP: baseHandleRsvp returned ${success}`);
      
      // Restore scroll position with multiple approaches for reliability
      setTimeout(() => {
        restorePosition(position);
        
        // Additional scroll restoration with timeout for reliability
        setTimeout(() => {
          window.scrollTo({
            top: position,
            behavior: 'auto'
          });
          document.body.classList.remove('rsvp-in-progress');
        }, 50);
      }, 0);
      
      return success;
    } catch (error) {
      console.error('Error in enhanced RSVP with scroll preservation:', error);
      
      // Even on error, try to restore position
      restorePosition(position);
      
      // Additional restoration attempt
      setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior: 'auto'
        });
        document.body.classList.remove('rsvp-in-progress');
      }, 50);
      
      // Show error feedback
      toast.error("Failed to update RSVP");
      
      return false;
    }
  }, [baseHandleRsvp, savePosition, restorePosition, userId]);

  return {
    handleRsvp,
    loading
  };
};
