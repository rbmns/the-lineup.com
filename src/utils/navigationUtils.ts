
/**
 * Utility for handling navigation with scroll restoration
 */

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
 * Handles any post-navigation tasks like scrolling
 * Can be used in useEffect after navigation events
 */
export const handlePostNavigation = () => {
  // Scroll to the top of the page
  window.scrollTo(0, 0);
};
