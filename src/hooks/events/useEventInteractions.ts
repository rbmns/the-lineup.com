
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
    
    // Navigate to the event detail page
    navigate(eventUrl, {
      state: { 
        fromDirectNavigation: true,
        forceRefresh: true,
        timestamp: Date.now()
      }
    });
  }, [navigate]);
  
  const navigateToEvent = useCallback((event: Event) => {
    if (!event?.id) {
      console.error("Cannot navigate: event is missing ID");
      return;
    }
    
    // Always use ID-based URLs for internal navigation
    const eventUrl = `/events/${event.id}`;
    navigate(eventUrl);
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
