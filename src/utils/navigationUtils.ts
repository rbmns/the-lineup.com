
import { NavigateFunction } from 'react-router-dom';
import { isProfileClickable } from './friendshipUtils';
import { getEventUrl } from './canonicalUtils';

/**
 * Utility function to navigate to a user profile page with improved reliability
 * @param userId The ID of the user to navigate to
 * @param navigate React Router's navigate function
 * @param friendshipStatus Optional friendship status to check before navigation
 * @param isCurrentUser Optional flag indicating if this is the current user's profile
 */
export const navigateToUserProfile = (
  userId: string, 
  navigate: NavigateFunction,
  friendshipStatus?: 'none' | 'pending' | 'accepted',
  isCurrentUser?: boolean
) => {
  if (!userId) {
    console.error("Cannot navigate: missing user ID");
    return;
  }
  
  // When looking at our own profile or if status isn't provided, just navigate
  if (isCurrentUser === true || friendshipStatus === undefined) {
    console.log(`Navigating to user profile (own profile or undefined status): ${userId}`);
  } else {
    // Check if navigation should be allowed based on friendship status
    const canNavigate = isProfileClickable(friendshipStatus, !!isCurrentUser);
    if (!canNavigate) {
      console.log(`Navigation blocked: User ${userId} profile is not accessible with status ${friendshipStatus}`);
      return;
    }
    console.log(`Navigating to friend profile with status: ${friendshipStatus}`);
  }
  
  try {
    // Clear any existing navigation state to prevent issues
    sessionStorage.removeItem('lastProfileNavigation');
    
    // Add state to the navigation to prevent unwanted redirects
    navigate(`/users/${userId}`, { 
      state: { 
        fromDirectNavigation: true,
        timestamp: Date.now(),
        source: 'profile_navigation'
      },
      replace: false // Don't replace the current history entry
    });
    
    // Set a flag in sessionStorage to track navigation
    sessionStorage.setItem('lastProfileNavigation', JSON.stringify({
      userId,
      timestamp: Date.now(),
      fromDirectNavigation: true
    }));
    
    // Debug log the navigation
    console.log(`Profile navigation completed to: /users/${userId}`);
  } catch (error) {
    console.error(`Navigation error:`, error);
  }
};

/**
 * Utility function to navigate to an event detail page using SEO-friendly URLs
 * @param eventId The ID of the event to navigate to
 * @param navigate React Router's navigate function
 * @param event Optional event object for SEO-friendly URLs
 * @param preserveSource Whether to preserve source information in navigation state
 */
export const navigateToEvent = (
  eventId: string, 
  navigate: NavigateFunction, 
  event?: any,
  preserveSource: boolean = false
) => {
  if (!eventId) {
    console.error("Cannot navigate: missing event ID");
    return;
  }
  
  try {
    // Build navigation state with transition flags
    const navigationState = {
      timestamp: Date.now(),
      source: 'event_navigation',
      fromDirectNavigation: true,
      fromEventNavigation: true, // Flag for transition effects
      useTransition: true,       // Enable transitions
      forceRefresh: true,        // Always force refresh of data
      originalEventId: eventId   // Always preserve the original ID for fallback
    };
    
    // Always use SEO-friendly URL format with destination priority
    if (event) {
      const url = getEventUrl(event, true);
      console.log(`Navigating to SEO URL: ${url}`, { event });
      navigate(url, { 
        state: navigationState,
        replace: false
      });
    } else {
      // If we only have ID, use the basic format but log a warning
      console.warn(`Limited navigation data: only ID ${eventId} available. Using basic URL format.`);
      navigate(`/events/${eventId}`, { 
        state: navigationState,
        replace: false
      });
    }
  } catch (error) {
    console.error("Navigation error:", error);
  }
};

/**
 * Helper function to safely go back in navigation history
 * @param navigate NavigateFunction from React Router
 * @param fallbackPath Fallback path if history navigation fails
 */
export const safeGoBack = (navigate: NavigateFunction, fallbackPath: string = '/events') => {
  try {
    window.history.back();
    
    // Set a timeout to check if navigation was successful
    setTimeout(() => {
      // If we're still on the same page after a short delay, use the fallback
      navigate(fallbackPath);
    }, 300);
  } catch (err) {
    console.error("Navigation error going back:", err);
    navigate(fallbackPath);
  }
};
