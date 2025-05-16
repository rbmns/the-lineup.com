
import { useState, useEffect } from 'react';
import { Event } from '@/types'; // Assuming Event type is available

export const useAvailableFilterOptions = (events: Event[] | undefined) => {
  const [availableEventTypes, setAvailableEventTypes] = useState<Array<{ value: string; label: string }>>([]);
  const [availableVenues, setAvailableVenues] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    if (events && events.length > 0) {
      const uniqueEventTypes = [...new Set(events.map(event => event.event_type).filter(Boolean))]
        .map(type => ({ value: type as string, label: type as string }));
      setAvailableEventTypes(uniqueEventTypes);

      const uniqueVenues = [...new Set(events.map(event => event.venues?.name).filter(Boolean))]
        .map(venueName => ({ value: venueName as string, label: venueName as string }));
      setAvailableVenues(uniqueVenues);
    } else {
      setAvailableEventTypes([]);
      setAvailableVenues([]);
    }
  }, [events]);

  return {
    availableEventTypes,
    availableVenues,
  };
};
