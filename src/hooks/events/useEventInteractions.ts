
import { useState, useCallback } from 'react';
import { Event } from '@/types';
import { useEventNavigation } from '@/hooks/useEventNavigation';

export const useEventInteractions = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { navigateToEvent } = useEventNavigation();
  
  const handleEventClick = useCallback((event: Event) => {
    console.log("useEventInteractions: handleEventClick", event);
    
    if (!event?.id) {
      console.error("Cannot navigate: event is missing ID");
      return;
    }
    
    // Always pass the full event object for SEO-friendly URLs
    navigateToEvent(event);
  }, [navigateToEvent]);
  
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
