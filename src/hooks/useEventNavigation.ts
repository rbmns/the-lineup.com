
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEventUrl } from '@/utils/canonicalUtils';

/**
 * Hook to provide consistent event navigation across the app,
 * ensuring all event links use the SEO-friendly URL format
 * with smooth transitions between events
 */
export const useEventNavigation = () => {
  const navigate = useNavigate();
  
  const navigateToEvent = useCallback((event: { 
    id: string; 
    unique_id?: string; 
    slug?: string;
    destination?: string;
    title?: string; 
    start_time?: string | Date;
  }) => {
    if (!event?.id) {
      console.error("Cannot navigate: missing event ID");
      return;
    }
    
    // Always use SEO-friendly format with destination when available
    // Force using slugs instead of IDs whenever possible
    const url = getEventUrl(event, true);
    console.log(`Enhanced navigation to event URL: ${url}`, event);
    
    // Debug log to help identify if we're still using IDs
    if (url.includes('/events/') && !url.includes('-') && !url.includes('/destinations/')) {
      console.warn('Using ID-based URL for navigation - missing date-based slug:', url);
    }
    
    // Force navigation to the generated URL rather than using the event ID
    // Add transition state to enable smooth animations between events
    navigate(url, { 
      replace: false,
      state: { 
        fromDirectNavigation: true,
        forceRefresh: true,
        fromEventNavigation: true, // Flag to indicate we're navigating between events
        useTransition: true, // Enable transitions
        originalEventId: event.id, // Always preserve the original ID for fallback
        timestamp: Date.now()
      }
    });
  }, [navigate]);
  
  // Navigate to destination events
  const navigateToDestinationEvents = useCallback((destination: string, eventType?: string) => {
    if (!destination) {
      console.error('Cannot navigate: missing destination');
      return;
    }
    
    const encodedDestination = encodeURIComponent(destination.toLowerCase());
    const baseUrl = `/destinations/${encodedDestination}/events`;
    const url = eventType ? `${baseUrl}/${encodeURIComponent(eventType.toLowerCase())}` : baseUrl;
    
    console.log(`Navigation to destination events: ${url}`);
    navigate(url);
  }, [navigate]);
  
  return {
    navigateToEvent,
    navigateToDestinationEvents
  };
};
