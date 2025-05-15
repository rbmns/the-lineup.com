
import { useCallback } from 'react';

interface ScrollState {
  position: number;
  data?: any;
}

export const useScrollPosition = () => {
  // Save current scroll position
  const savePosition = useCallback((): number => {
    return window.scrollY;
  }, []);

  // Restore scroll position
  const restorePosition = useCallback((position: number): void => {
    window.scrollTo({
      top: position,
      behavior: 'auto' // Use 'auto' instead of 'smooth' to prevent animation
    });
  }, []);

  // Helper to run a callback while preserving scroll position
  const withScrollPreservation = useCallback(async <T>(callback: () => Promise<T>): Promise<T> => {
    const savedPosition = savePosition();
    try {
      const result = await callback();
      // Restore position after a small delay to ensure DOM has updated
      setTimeout(() => {
        restorePosition(savedPosition);
      }, 50);
      return result;
    } catch (error) {
      // Still restore position even if there was an error
      setTimeout(() => {
        restorePosition(savedPosition);
      }, 50);
      throw error;
    }
  }, [savePosition, restorePosition]);

  // Save both position and some state data
  const savePositionAndState = useCallback((stateData?: any): ScrollState => {
    return {
      position: window.scrollY,
      data: stateData
    };
  }, []);

  // Restore both position and return the saved state data
  const restorePositionAndState = useCallback((state: ScrollState): any => {
    window.scrollTo({
      top: state.position,
      behavior: 'auto'
    });
    return state.data;
  }, []);

  return {
    savePosition,
    restorePosition,
    withScrollPreservation,
    savePositionAndState,
    restorePositionAndState
  };
};
