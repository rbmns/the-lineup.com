
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track the previous path when navigating
 */
export const usePreviousPathRef = () => {
  const location = useLocation();
  const previousPath = useRef(document.referrer);

  // Save the previous path when component mounts
  useEffect(() => {
    // Store the location that led to this page as the previous path
    // Only update if this is a fresh navigation (not a related event click)
    const currentPath = location.pathname;
    if (!currentPath.includes('/events/') || !previousPath.current.includes('/events/')) {
      previousPath.current = document.referrer || '/events';
    }
  }, [location]);

  return previousPath;
};
