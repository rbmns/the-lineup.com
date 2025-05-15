
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to provide consistent event navigation across the app,
 * ensuring all event links use ID-based navigation for consistency
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
      toast({
        title: "Navigation Error",
        description: "Could not navigate to event page - missing ID",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Always use ID-based URLs for internal navigation
      const url = `/events/${event.id}`;
      console.log(`Navigation to event URL: ${url}`, event);
      
      // Force navigation to the ID-based URL
      navigate(url, { 
        replace: false,
        state: { 
          fromDirectNavigation: true,
          forceRefresh: true,
          fromEventNavigation: true,
          useTransition: true,
          originalEventId: event.id,
          timestamp: Date.now()
        }
      });
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to event page",
        variant: "destructive",
      });
    }
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
