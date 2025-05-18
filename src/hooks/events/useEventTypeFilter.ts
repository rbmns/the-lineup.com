
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
        if (event.event_type) eventTypeSet.add(event.event_type);
      });
      
      const eventTypeOptions = Array.from(eventTypeSet).map(type => ({
        value: type,
        label: type
      })).sort((a, b) => a.label.localeCompare(b.label));
      
      setAvailableEventTypes(eventTypeOptions);
      
      // Set all event types as selected by default
      const allEventTypes = eventTypeOptions.map(option => option.value);
      setSelectedEventTypes(prevSelected => {
        // Only set all as selected if we don't have any selection yet
        return prevSelected.length === 0 ? allEventTypes : prevSelected;
      });
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
