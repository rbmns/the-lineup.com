
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll to top on mount (e.g., when entering a new page).
 * Also handles scroll behavior based on navigation state.
 */
export const useScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we should preserve scroll (e.g., from RSVP actions)
    const state = location.state as any;
    
    if (state?.preserveScroll) {
      // Don't scroll if we're preserving scroll position
      console.log('Preserving scroll position due to navigation state');
      return;
    }
    
    // Default behavior: scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Scrolled to top on page navigation');
  }, [location.pathname, location.state]);
};
