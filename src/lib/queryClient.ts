
import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds - reduced to ensure fresh data
      retry: 1,
      // Important for consistent state between routes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      // Add listeners to preserve URL parameters during query updates
      meta: {
        preserveFilters: true // Flag that can be used to check if filters should be preserved
      }
    },
  },
});

// Enhanced history API interception with stronger protection
if (typeof window !== 'undefined') {
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;
  
  // Monkey-patch pushState with improved protection
  window.history.pushState = function(...args) {
    // Check if we're in the middle of an RSVP operation
    if (window.rsvpInProgress) {
      console.log('Intercepted pushState during RSVP', args);
      
      // Block ALL state changes during RSVP operations on the events page
      if (window.location.pathname.includes('/events')) {
        // Get current time to check if this is a recent RSVP operation
        const currentTime = Date.now();
        const rsvpStartTime = window._filterStateBeforeRsvp?.timestamp || 0;
        const timeSinceRsvpStart = currentTime - rsvpStartTime;
        
        // Block state changes during active RSVP operations (within last 5 seconds)
        if (timeSinceRsvpStart < 5000) {
          console.log('Blocking pushState during active RSVP');
          
          // Create a custom event to notify about blocked navigation
          const blockedEvent = new CustomEvent('rsvpNavigationBlocked', {
            detail: {
              originalArgs: args,
              type: 'pushState',
              timestamp: currentTime
            }
          });
          document.dispatchEvent(blockedEvent);
          
          // Don't call original implementation to block the state change
          return;
        }
      }
    }
    
    // Call original implementation
    return originalPushState.apply(this, args);
  };
  
  // Monkey-patch replaceState with improved protection
  window.history.replaceState = function(...args) {
    // Check if we're in the middle of an RSVP operation
    if (window.rsvpInProgress) {
      console.log('Intercepted replaceState during RSVP', args);
      
      // Block state changes during RSVP operations on the events page
      if (window.location.pathname.includes('/events')) {
        // Check if this is coming from React Query's automatic URL updates
        const currentTime = Date.now();
        const rsvpStartTime = window._filterStateBeforeRsvp?.timestamp || 0;
        const timeSinceRsvpStart = currentTime - rsvpStartTime;
        
        // Block ALL replaceState calls during active RSVP (within last 5 seconds)
        if (timeSinceRsvpStart < 5000) {
          console.log('Blocking replaceState during active RSVP');
          
          // Create a custom event to notify about blocked navigation
          const blockedEvent = new CustomEvent('rsvpNavigationBlocked', {
            detail: {
              originalArgs: args,
              type: 'replaceState',
              timestamp: currentTime
            }
          });
          document.dispatchEvent(blockedEvent);
          
          // Don't call original implementation to block the state change
          return;
        }
      }
    }
    
    // Call original implementation
    return originalReplaceState.apply(this, args);
  };
}
