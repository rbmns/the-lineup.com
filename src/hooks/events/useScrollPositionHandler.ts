
import { useEffect, useRef, RefObject } from 'react';
import { Event } from '@/types';
import { useScrollPosition } from '@/hooks/useScrollPosition';

const SCROLL_POSITION_KEY = 'eventsScrollPosition';

export const useScrollPositionHandler = (
  initialRenderRef: RefObject<boolean>,
  scrollRestoredRef: RefObject<boolean>,
  rsvpInProgressRef: RefObject<boolean>,
  events: Event[]
) => {
  const { savePosition, restorePosition } = useScrollPosition();
  const isRestoringRef = useRef(false);
  const lastEventsLengthRef = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);
  
  // Local refs to track state since we can't modify the passed refs directly
  const localInitialRender = useRef(initialRenderRef.current);
  const localScrollRestored = useRef(scrollRestoredRef.current);

  // Effect for handling initial page load and scroll restoration
  useEffect(() => {
    if (!localInitialRender.current) {
      // Update local ref instead of the passed ref
      localInitialRender.current = true;
      console.log("Initial render of events list");
      
      // Get position from sessionStorage
      const storedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
      
      if (storedPosition && !localScrollRestored.current && !isRestoringRef.current) {
        isRestoringRef.current = true;
        
        // Restore position after data is loaded and components are rendered
        const timeout = window.setTimeout(() => {
          try {
            const position = parseInt(storedPosition, 10);
            if (!isNaN(position) && position > 0) {
              restorePosition(position);
              console.log('Scroll position restored:', position);
            }
            
            // Update local ref instead of the passed ref
            localScrollRestored.current = true;
            isRestoringRef.current = false;
            
            // Clear the stored position
            sessionStorage.removeItem(SCROLL_POSITION_KEY);
          } catch (error) {
            console.error('Error restoring scroll position:', error);
            isRestoringRef.current = false;
          }
        }, 100);
        
        return () => {
          if (timeout) clearTimeout(timeout);
        };
      }
    }
    
    return () => {};
  }, [initialRenderRef, scrollRestoredRef, restorePosition]);
  
  // Effect for handling events list changes
  useEffect(() => {
    // Skip the first render and if RSVP is in progress
    if (!localInitialRender.current || rsvpInProgressRef.current) return;
    
    // If events length changed and it wasn't empty before, it's likely a filter change
    if (lastEventsLengthRef.current > 0 && events.length !== lastEventsLengthRef.current) {
      console.log('Events list changed, scrolling to top');
      // Scroll to top with a small delay to ensure render is complete
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      
      scrollTimeoutRef.current = window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 100) as unknown as number;
    }
    
    lastEventsLengthRef.current = events.length;
    
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [events, initialRenderRef, rsvpInProgressRef]);
  
  // Save scroll position before unmount
  useEffect(() => {
    return () => {
      // Don't save position during RSVP operations
      if (!rsvpInProgressRef.current && events.length > 0) {
        const position = savePosition();
        if (position > 0) {
          sessionStorage.setItem(SCROLL_POSITION_KEY, String(position));
          console.log('Saved scroll position on unmount:', position);
        }
      }
    };
  }, [events, rsvpInProgressRef, savePosition]);
};
