import { useNavigate } from 'react-router-dom';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { useNavigationWithScrollPreservation } from '@/hooks/useNavigationWithScrollPreservation';

export const useEventDetailHandlers = () => {
  const navigate = useNavigate();
  
  const { withScrollPreservation } = useNavigationWithScrollPreservation();
  
  // Use our navigation history hook
  const { 
    getPreviousPath, 
    hasFilteredEventsHistory, 
    getFilteredEventsPath 
  } = useNavigationHistory();
  
  // Determine back button behavior based on navigation history
  const handleBackToEvents = () => {
    if (hasFilteredEventsHistory()) {
      // Go back to filtered results if we came from there
      navigate(getFilteredEventsPath());
    } else {
      // Otherwise go to the generic events page
      navigate('/events');
    }
  };

  const handleBackToPrevious = () => {
    const previousPath = getPreviousPath();
    navigate(previousPath.fullPath);
  };

  const handleEventTypeClick = (eventType?: string) => {
    if (eventType) {
      navigate(`/events?type=${encodeURIComponent(eventType)}`);
    }
  };
  
  // Wrap RSVP actions with scroll preservation
  const wrapRsvpWithScrollPreservation = (
    originalHandleRsvpAction: (status: 'Going' | 'Interested') => Promise<boolean>
  ) => {
    return async (status: 'Going' | 'Interested'): Promise<boolean> => {
      console.log(`EventDetail: Handling RSVP with status ${status}`);
      
      // Cache current scroll position
      const scrollPosition = window.scrollY;
      
      try {
        // Execute the RSVP action
        const result = await originalHandleRsvpAction(status);
        
        // Restore scroll position after a slight delay to ensure DOM updates have happened
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition, behavior: 'auto' });
        }, 50);
        
        return result;
      } catch (error) {
        console.error("Error handling RSVP:", error);
        return false;
      }
    };
  };

  return {
    handleBackToEvents,
    handleBackToPrevious,
    handleEventTypeClick,
    wrapRsvpWithScrollPreservation
  };
};
