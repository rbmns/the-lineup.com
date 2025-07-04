
import { useState, useEffect } from 'react';
import { Event } from '@/types';

export const useEventTypeFilter = (events: Event[] | undefined = []) => {
  const [availableEventTypes, setAvailableEventTypes] = useState<Array<{value: string, label: string}>>([]);
  const [showEventTypeFilter, setShowEventTypeFilter] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

  // Set up available event types and select all by default
  useEffect(() => {
    if (events && events.length > 0) {
      const eventTypeSet = new Set<string>();
      events.forEach(event => {
        if (event.event_category) eventTypeSet.add(event.event_category);
      });
      
      const eventTypeOptions = Array.from(eventTypeSet).map(type => ({
        value: type,
        label: type
      })).sort((a, b) => a.label.localeCompare(b.label));
      
      setAvailableEventTypes(eventTypeOptions);
      
      // Set all event types as selected by default
      const allEventTypes = eventTypeOptions.map(option => option.value);
      setSelectedEventTypes(allEventTypes);
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
