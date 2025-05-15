
import { useCallback } from 'react';

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

  return {
    savePosition,
    restorePosition
  };
};
