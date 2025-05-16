
import { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to extract and normalize event detail parameters from the URL
 * and manage initial fetch state for events
 */
export const useEventDetailParams = () => {
  // Get route parameters
  const { eventId, eventSlug, destination } = useParams<{ 
    eventId?: string; 
    eventSlug?: string;
    destination?: string;
  }>();
  
  // Get location state from React Router
  const location = useLocation();
  
  // Track if initial data fetch has been done
  const initialFetchDone = useRef(false);
  
  // Generate a unique key for rendering the component when route changes
  const [forceKey] = useState(() => uuidv4());
  
  // Store previous URL to prevent unnecessary resets
  const previousUrlRef = useRef(location.pathname);
  
  // Determine which type of route we're on
  const isSlugRoute = useMemo(() => Boolean(eventSlug), [eventSlug]);
  const isDestinationRoute = useMemo(() => Boolean(destination), [destination]);
  
  // Check if we have transition state for animations
  const hasTransitionState = useMemo(() => 
    location.state?.useTransition === true || location.state?.fromEventNavigation === true,
    [location.state]
  );

  // Extract RSVP status from location state if available
  const initialRsvpStatus = useMemo(() => 
    location.state?.rsvpStatus || null,
    [location.state]
  );

  const originalEvent = useMemo(() => 
    location.state?.originalEvent || null,
    [location.state]
  );

  // Log the parameters for debugging
  useEffect(() => {
    console.log(`useEventDetailParams: eventId=${eventId}, eventSlug=${eventSlug}, destination=${destination}`);
    console.log(`Route path: ${location.pathname}`);
    if (location.state) {
      console.log("Route state:", location.state);
    }
  }, [eventId, eventSlug, destination, location]);

  // Determine the actual ID to use for fetching, prioritizing explicit IDs
  const id = useMemo(() => {
    // First, use an explicit ID from the route if available
    if (eventId) return eventId;
    
    // If not, check if eventSlug is actually a UUID
    const isUUID = eventSlug && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventSlug);
    if (isUUID) return eventSlug;
    
    // Otherwise, if we have an ID in the location state, use that
    if (location.state?.originalEventId) return location.state.originalEventId;
    
    // Check if the pathname itself contains a UUID
    const pathMatch = location.pathname.match(/\/events\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }
    
    // Last resort, return null as we can't determine an ID
    return null;
  }, [eventId, eventSlug, location.pathname, location.state]);
  
  // Reset initialFetchDone when the route changes and scroll to top
  useEffect(() => {
    const currentUrl = location.pathname;
    if (previousUrlRef.current !== currentUrl) {
      console.log(`URL changed from ${previousUrlRef.current} to ${currentUrl}, resetting fetch state`);
      initialFetchDone.current = false;
      previousUrlRef.current = currentUrl;
      
      // Force scroll to top on URL change
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Use 'instant' instead of 'auto' for immediate scroll
      });
    }
  }, [location.pathname]);

  return {
    id,
    eventId,
    eventSlug,
    destination,
    location,
    initialFetchDone,
    forceKey,
    isSlugRoute,
    isDestinationRoute,
    hasTransitionState,
    // Export the initial RSVP status from navigation state
    initialRsvpStatus,
    originalEvent
  };
};
