
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
    
    // Use simple ID-based route
    const eventRoute = `/events/${event.id}`;
    
    navigate(eventRoute, {
      state: preserveScroll ? { preserveScroll: true } : { scrollToTop: true }
    });

    // Scroll to top unless preserveScroll is true
    if (!preserveScroll) {
      // Use setTimeout to ensure navigation completes first
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const navigateToDestinationEvents = (destination: string) => {
    // Navigate to events page with destination filter
    navigate(`/events?destination=${encodeURIComponent(destination)}`);
    
    // Scroll to top for filter navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return { navigateToEvent, navigateToDestinationEvents };
};
