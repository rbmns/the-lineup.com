
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to provide consistent event navigation across the app,
 * ensuring all event links use ID-based navigation for consistency
 */
export const useEventNavigation = () => {
  const navigate = useNavigate();
  
  /**
   * Navigate to event detail page using consistent ID-based URL
   * and with appropriate navigation state for smooth transitions
   */
  const navigateToEvent = useCallback((event: { 
    id: string; 
    unique_id?: string; 
    slug?: string;
    destination?: string;
    title?: string; 
    start_time?: string | Date;
    rsvp_status?: 'Going' | 'Interested' | null;
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
      
      // Preserve essential information including RSVP status with higher specificity
      const originalEvent = {
        id: event.id,
        title: event.title,
        rsvp_status: event.rsvp_status || null
      };
      
      // Force navigation to the ID-based URL with enhanced RSVP status handling
      navigate(url, { 
        replace: false,
        state: { 
          fromDirectNavigation: true,
          forceRefresh: true,
          fromEventNavigation: true,
          useTransition: true,
          originalEventId: event.id,
          // Ensure RSVP status is explicitly included and prioritized
          rsvpStatus: event.rsvp_status || null,
          originalEvent,
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
