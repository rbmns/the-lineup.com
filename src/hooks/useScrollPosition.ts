
import { useCallback, useRef } from 'react';

export const useScrollPosition = () => {
  const lastPositionRef = useRef<number>(0);

  const savePosition = useCallback(() => {
    const position = window.scrollY;
    lastPositionRef.current = position;
    return position;
  }, []);

  const restorePosition = useCallback((position: number) => {
    window.scrollTo({
      top: position,
      behavior: 'auto' // Use 'auto' for immediate scrolling without animation
    });
  }, []);

  const withScrollPreservation = useCallback(async (callback: () => Promise<any>) => {
    const position = savePosition();
    console.log(`Preserving scroll position: ${position}px`);
    
    try {
      const result = await callback();
      
      // Restore scroll position after the callback completes
      setTimeout(() => {
        restorePosition(position);
        console.log(`Restored scroll position to: ${position}px`);
      }, 50);
      
      return result;
    } catch (error) {
      // Restore scroll position even on error
      setTimeout(() => restorePosition(position), 50);
      throw error;
    }
  }, [savePosition, restorePosition]);

  // Update this function to use the stored position if none is provided
  const restorePositionAndState = useCallback((position?: number) => {
    const positionToRestore = position !== undefined ? position : lastPositionRef.current;
    restorePosition(positionToRestore);
  }, [restorePosition]);

  return {
    savePosition,
    restorePosition,
    withScrollPreservation,
    restorePositionAndState
  };
};
