
import { NavigateFunction } from 'react-router-dom';

/**
 * Navigate to a user's profile page with proper state management
 */
export const navigateToUserProfile = (userId: string, navigate: NavigateFunction, friendshipStatus?: string, isCurrentUser?: boolean) => {
  if (!userId) {
    console.error('Cannot navigate: missing user ID');
    return;
  }
  
  // Navigate to user profile page - using /users/:userId route
  console.log(`Navigating to user profile: ${userId}`);
  navigate(`/users/${userId}`, {
    state: { 
      fromProfileNavigation: true,
      timestamp: Date.now()
    }
  });
};

/**
 * Navigate to an event detail page with proper state management
 */
export const navigateToEvent = (eventId: string, navigate: NavigateFunction, event?: any, preserveFilters?: boolean) => {
  if (!eventId) {
    console.error('Cannot navigate: missing event ID');
    return;
  }
  
  // Navigate to event detail page
  console.log(`Navigating to event: ${eventId}`);
  navigate(`/events/${eventId}`, {
    state: { 
      fromEventNavigation: true,
      preserveFilters: preserveFilters || false,
      timestamp: Date.now()
    }
  });
};

/**
 * Safely navigate back or to default path if history is not available
 */
export const safeGoBack = (navigate: NavigateFunction, defaultPath: string) => {
  try {
    // Try to go back in history
    window.history.back();
    
    // Fallback if history navigation doesn't trigger (will be caught in setTimeout)
    const timeoutId = setTimeout(() => {
      console.log("History navigation didn't trigger, using navigate fallback");
      navigate(defaultPath);
    }, 100);
    
    // Clear timeout if the page actually changes (user navigates away)
    window.addEventListener('beforeunload', () => clearTimeout(timeoutId), { once: true });
  } catch (err) {
    console.error("Error navigating back:", err);
    navigate(defaultPath);
  }
};

/**
 * Update URL parameters without triggering a page reload
 */
export const updateUrlParameters = (
  filterState: Record<string, any>,
  navigate: NavigateFunction,
  currentPath: string
) => {
  const urlParams = new URLSearchParams();
  
  // Process event types
  if (filterState.eventTypes && filterState.eventTypes.length > 0) {
    filterState.eventTypes.forEach((type: string) => {
      urlParams.append('type', type);
    });
  }
  
  // Process venues
  if (filterState.venues && filterState.venues.length > 0) {
    filterState.venues.forEach((venue: string) => {
      urlParams.append('venue', venue);
    });
  }
  
  // Process date range
  if (filterState.dateRange?.from) {
    urlParams.set('dateFrom', filterState.dateRange.from.toISOString());
    if (filterState.dateRange.to) {
      urlParams.set('dateTo', filterState.dateRange.to.toISOString());
    }
  }
  
  // Process date filter
  if (filterState.dateFilter) {
    urlParams.set('dateFilter', filterState.dateFilter);
  }
  
  // Update URL without causing navigation
  const queryString = urlParams.toString();
  const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;
  
  navigate(newUrl, { replace: true });
};
