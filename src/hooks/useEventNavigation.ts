
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';

export const useEventNavigation = () => {
  const navigate = useNavigate();

  const navigateToEvent = (event: Event, preserveScroll: boolean = false) => {
    if (!event.id) {
      console.error('Cannot navigate: Missing event ID');
      return;
    }

    console.log('Navigating to event:', event.id);
    
    // Use simple ID-based route - this should match the route in App.tsx
    const eventRoute = `/events/${event.id}`;
    
    // Navigate to the event detail page
    navigate(eventRoute, {
      state: preserveScroll ? { preserveScroll: true } : undefined
    });
  };

  const navigateToDestinationEvents = (destination: string) => {
    // Navigate to events page with destination filter
    navigate(`/events?destination=${encodeURIComponent(destination)}`);
  };

  return { navigateToEvent, navigateToDestinationEvents };
};
