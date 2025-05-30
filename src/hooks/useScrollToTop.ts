
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if this navigation was from an RSVP action or similar button click
    const state = location.state as any;
    const preserveScroll = state?.preserveScroll || state?.fromRsvp;
    
    // Define pages that should always scroll to top when navigating TO events page
    const alwaysScrollToTopFrom = ['/', '/casual-plans', '/friends'];
    const comingFromScrollToTopPage = state?.from && alwaysScrollToTopFrom.includes(state.from);
    
    // Always scroll to top if coming from home, casual plans, or friends pages
    // OR if we're not preserving scroll position
    if (comingFromScrollToTopPage || !preserveScroll) {
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
