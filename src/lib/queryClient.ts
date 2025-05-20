
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

// Add a global listener to prevent filter loss during ongoing RSVP operations
if (typeof window !== 'undefined') {
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;
  
  // Monkey-patch pushState to detect and prevent filter loss
  window.history.pushState = function(...args) {
    // Check if we're in the middle of an RSVP operation
    if (window.rsvpInProgress) {
      console.log('Intercepted pushState during RSVP, checking if we need to block it', args);
      
      // Only allow pushState if it's not changing event filters
      const newUrl = args[2] as string;
      if (newUrl && newUrl.includes('eventType=') && window._filterStateBeforeRsvp) {
        const currentTime = Date.now();
        const timeSinceRsvpStart = currentTime - (window._filterStateBeforeRsvp.timestamp || 0);
        
        // Only block recent RSVP operations (within last 2 seconds)
        if (timeSinceRsvpStart < 2000) {
          console.log('Blocking pushState that would change filters during RSVP');
          // Don't call original function to block the state change
          return;
        }
      }
    }
    
    // Call original implementation
    return originalPushState.apply(this, args);
  };
  
  // Monkey-patch replaceState to detect and prevent filter loss
  window.history.replaceState = function(...args) {
    // Check if we're in the middle of an RSVP operation
    if (window.rsvpInProgress) {
      console.log('Intercepted replaceState during RSVP, checking if we need to block it', args);
      
      // Only allow replaceState if it's not changing event filters
      const newUrl = args[2] as string;
      if (newUrl && newUrl.includes('eventType=') && window._filterStateBeforeRsvp) {
        const currentTime = Date.now();
        const timeSinceRsvpStart = currentTime - (window._filterStateBeforeRsvp.timestamp || 0);
        
        // Only block recent RSVP operations (within last 2 seconds)
        if (timeSinceRsvpStart < 2000) {
          console.log('Blocking replaceState that would change filters during RSVP');
          // Don't call original function to block the state change
          return;
        }
      }
    }
    
    // Call original implementation
    return originalReplaceState.apply(this, args);
  };
  
  // Add a global event listener to handle filter restoration
  document.addEventListener('filtersRestored', (event: Event) => {
    const customEvent = event as CustomEvent;
    console.log('Filters restored event received:', customEvent.detail);
    
    // Notify components that might need to update their UI state
    // This will be used by filter components to sync their UI with restored URL parameters
  });
}
