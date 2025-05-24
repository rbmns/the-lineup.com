
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';

export const useEventNavigation = () => {
  const navigate = useNavigate();

  const navigateToEvent = (event: Event, preserveScroll: boolean = false) => {
    if (!event.id) {
      console.error('Cannot navigate: Missing event ID');
      return;
    }

    // Determine route based on event properties
    const eventRoute = `/events/${event.id}`;
    
    navigate(eventRoute, {
      state: preserveScroll ? { preserveScroll: true } : undefined
    });
  };

  return { navigateToEvent };
};
