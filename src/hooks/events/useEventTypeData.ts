
import { useMemo } from 'react';
import { Event } from '@/types';

export const useEventTypeData = (events: Event[]) => {
  // Get all unique event types from events
  const allEventTypes = useMemo(() => {
    const types = events.map(event => event.event_type).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
  return { allEventTypes };
};
