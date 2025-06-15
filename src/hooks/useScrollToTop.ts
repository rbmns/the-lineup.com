
import { useEffect } from 'react';

/**
 * Scroll to top on mount (e.g., when entering a new page).
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
};
