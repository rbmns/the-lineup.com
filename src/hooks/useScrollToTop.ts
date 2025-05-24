
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if this navigation was from an RSVP action or similar button click
    const state = location.state as any;
    const preserveScroll = state?.preserveScroll || state?.fromRsvp;
    
    // Only scroll to top if we're not preserving scroll position
    if (!preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Clean up the state to prevent interference with future navigations
    if (state?.preserveScroll || state?.fromRsvp) {
      window.history.replaceState(
        { ...state, preserveScroll: false, fromRsvp: false },
        ''
      );
    }
  }, [location.pathname]);
};
