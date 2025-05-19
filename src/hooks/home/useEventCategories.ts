
import { useState, useEffect } from 'react';
import { Event } from '@/types';

export const useEventCategories = (events: Event[] | undefined) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Extract available categories from events
  useEffect(() => {
    if (events && events.length > 0) {
      const categories = [...new Set(events.map(event => event.event_type).filter(Boolean))];
      setAvailableCategories(categories);
    }
  }, [events]);

  return {
    availableCategories
  };
};
