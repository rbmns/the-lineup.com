
import { useEffect, RefObject } from 'react';
import { Event } from '@/types';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export const useScrollPositionHandler = (
  initialRenderRef: RefObject<boolean>,
  scrollRestoredRef: RefObject<boolean>,
  rsvpInProgressRef: RefObject<boolean>,
  events: Event[]
) => {
  const { savePosition, restorePosition, savePositionAndState, restorePositionAndState } = useScrollPosition();

  // Restore scroll position after RSVP operations
  useEffect(() => {
    // Only run this effect once on initial render
    if (!initialRenderRef.current) {
      initialRenderRef.current = true;
      
      // Get position from sessionStorage
      const storedPosition = sessionStorage.getItem('eventsScrollPosition');
      
      if (storedPosition && !scrollRestoredRef.current) {
        // Restore position after data is loaded and components are rendered
        setTimeout(() => {
          try {
            const position = parseInt(storedPosition, 10);
            restorePosition(position);
            
            // Mark scroll as restored to prevent duplicate restoration
            scrollRestoredRef.current = true;
            
            // Clear the stored position
            sessionStorage.removeItem('eventsScrollPosition');
            
            console.log('Scroll position restored:', position);
          } catch (error) {
            console.error('Error restoring scroll position:', error);
          }
        }, 100);
      }
    }
    
    // Save scroll position before unmount
    return () => {
      // Don't save position during RSVP operations
      if (!rsvpInProgressRef.current && events.length > 0) {
        const position = savePosition();
        sessionStorage.setItem('eventsScrollPosition', String(position));
        console.log('Saved scroll position on unmount:', position);
      }
    };
  }, [
    initialRenderRef, 
    scrollRestoredRef, 
    rsvpInProgressRef, 
    events, 
    savePosition, 
    restorePosition
  ]);
};
