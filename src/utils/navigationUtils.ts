
/**
 * Utility for handling navigation with scroll restoration
 */

import { NavigateFunction } from "react-router-dom";

/**
 * Navigates to a URL and scrolls to the top of the page
 * @param url The URL to navigate to
 */
export const navigateAndScrollTop = (url: string) => {
  // Change the URL
  window.location.href = url;
  
  // Scroll to the top
  window.scrollTo(0, 0);
};

/**
 * Navigates to a user profile page
 * @param navigate The navigate function from useNavigate
 * @param userId The user ID to navigate to
 */
export const navigateToUserProfile = (navigate: NavigateFunction, userId: string) => {
  navigate(`/users/${userId}`);
  window.scrollTo(0, 0);
};

/**
 * Navigates to an event detail page
 * @param navigate The navigate function from useNavigate
 * @param eventId The event ID to navigate to
 */
export const navigateToEvent = (navigate: NavigateFunction, eventId: string) => {
  navigate(`/events/${eventId}`);
  window.scrollTo(0, 0);
};

/**
 * Safely navigate back or to a default path if there's no history
 * @param navigate The navigate function from useNavigate
 * @param defaultPath The default path to navigate to if there's no history
 */
export const safeGoBack = (navigate: NavigateFunction, defaultPath: string = '/') => {
  // Try to go back, if it fails, navigate to the default path
  try {
    window.history.back();
  } catch (err) {
    navigate(defaultPath);
    window.scrollTo(0, 0);
  }
};

/**
 * Handles any post-navigation tasks like scrolling
 * Can be used in useEffect after navigation events
 */
export const handlePostNavigation = () => {
  // Scroll to the top of the page
  window.scrollTo(0, 0);
};
