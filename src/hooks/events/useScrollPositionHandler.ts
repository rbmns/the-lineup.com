
import { useEffect, MutableRefObject } from 'react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Event } from '@/types';

export const useScrollPositionHandler = (
  initialRenderRef: MutableRefObject<boolean>,
  scrollRestoredRef: MutableRefObject<boolean>,
  rsvpInProgressRef: MutableRefObject<boolean>,
  filteredEvents: Event[],
) => {
  const { savePosition, restorePositionAndState } = useScrollPosition();
  
  // Restore scroll position and URL state on initial render
  useEffect(() => {
    if (scrollRestoredRef.current) return;
    
    // After a brief delay to let the component fully render
    const timeoutId = setTimeout(() => {
      // Call restorePositionAndState without parameters, the hook will handle it
      restorePositionAndState();
      scrollRestoredRef.current = true;
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [restorePositionAndState, scrollRestoredRef]);

  // Save scroll position on initial render and when filteredEvents changes
  useEffect(() => {
    // Skip on initial render to avoid interfering with browser's natural scroll restoration
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    // Skip saving position if we're in the middle of an RSVP action
    if (rsvpInProgressRef.current) {
      return;
    }
    
    // When filters/results change, we still want to preserve our position
    // Use a short delay to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      savePosition();
    }, 200);
    
    return () => clearTimeout(timeoutId);
  }, [filteredEvents, savePosition, initialRenderRef, rsvpInProgressRef]);
  
  return {
    savePosition,
    restorePositionAndState
  };
};
