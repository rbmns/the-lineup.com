
import { useState, useEffect } from 'react';
import { Event } from '@/types';

export const useEventTypeFilter = (events: Event[] | undefined = []) => {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [availableEventTypes, setAvailableEventTypes] = useState<Array<{value: string, label: string}>>([]);
  const [showEventTypeFilter, setShowEventTypeFilter] = useState(false);

  // Set up available event types
  useEffect(() => {
    if (events && events.length > 0) {
      const eventTypeSet = new Set<string>();
      events.forEach(event => {
        if (event.event_type) eventTypeSet.add(event.event_type);
      });
      
      const eventTypeOptions = Array.from(eventTypeSet).map(type => ({
        value: type,
        label: type
      })).sort((a, b) => a.label.localeCompare(b.label));
      
      setAvailableEventTypes(eventTypeOptions);
    } else {
      setAvailableEventTypes([]);
    }
  }, [events]);

  return {
    selectedEventTypes,
    setSelectedEventTypes,
    availableEventTypes,
    showEventTypeFilter,
    setShowEventTypeFilter
  };
};
