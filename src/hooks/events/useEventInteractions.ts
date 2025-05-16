
import { useState, useCallback } from 'react';
import { Event } from '@/types';
import { useNavigate } from 'react-router-dom';

export const useEventInteractions = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleEventClick = useCallback((event: Event) => {
    console.log("useEventInteractions: handleEventClick", event);
    
    if (!event?.id) {
      console.error("Cannot navigate: event is missing ID");
      return;
    }
    
    // Always navigate using UUID for consistency
    const eventUrl = `/events/${event.id}`;
    
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    
    // Pass RSVP status in navigation state to ensure it's available immediately on the detail page
    navigate(eventUrl, {
      state: { 
        fromDirectNavigation: true,
        forceRefresh: true,
        timestamp: Date.now(),
        // Include the RSVP status to maintain synchronization between views
        rsvpStatus: event.rsvp_status,
        originalEvent: {
          id: event.id,
          rsvp_status: event.rsvp_status,
          title: event.title
        }
      }
    });
  }, [navigate]);
  
  const navigateToEvent = useCallback((event: Event) => {
    if (!event?.id) {
      console.error("Cannot navigate: event is missing ID");
      return;
    }
    
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    
    // Always use ID-based URLs for internal navigation and preserve RSVP status
    const eventUrl = `/events/${event.id}`;
    navigate(eventUrl, {
      state: {
        fromEventNavigation: true,
        useTransition: true,
        originalEventId: event.id,
        // Include RSVP status in navigation state
        rsvpStatus: event.rsvp_status,
        timestamp: Date.now()
      }
    });
  }, [navigate]);
  
  const handleEventDetailOpen = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  }, []);
  
  const handleEventDetailClose = useCallback(() => {
    setIsDetailModalOpen(false);
    // Allow time for animation to complete before removing data
    setTimeout(() => setSelectedEvent(null), 300);
  }, []);
  
  return {
    selectedEvent,
    isDetailModalOpen,
    handleEventClick,
    handleEventDetailOpen,
    handleEventDetailClose,
    navigateToEvent
  };
};
