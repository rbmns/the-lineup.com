import { useState } from 'react';
import { Event } from '@/types';

export const useFilterState = () => {
  // By default, no specific event types are selected, which means all are displayed
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [aiSearchFilter, setAiSearchFilter] = useState<{
    categories?: string[], 
    location?: string, 
    date_range?: string,
    feedback?: string
  } | null>(null);

  // Toggle event type selection with updated logic
  const toggleEventType = (eventType: string) => {
    setSelectedEventTypes(prev => {
      // If this is the only selected event type, clicking it will deselect it
      if (prev.includes(eventType) && prev.length === 1) {
        return [];
      }
      
      // If this event type is already selected, remove it
      if (prev.includes(eventType)) {
        return prev.filter(type => type !== eventType);
      }
      
      // If no event types are currently selected, this becomes the only one
      if (prev.length === 0) {
        return [eventType];
      }
      
      // Otherwise, add this event type to the existing selection (OR logic)
      return [...prev, eventType];
    });
  };

  // Select a single event type, deselecting all others
  const selectSingleEventType = (eventType: string) => {
    setSelectedEventTypes([eventType]);
  };

  const resetFilters = () => {
    setSelectedEventTypes([]);
    setAiSearchFilter(null);
  };

  return {
    selectedEventTypes,
    setSelectedEventTypes,
    aiSearchFilter,
    setAiSearchFilter,
    toggleEventType,
    selectSingleEventType,
    resetFilters
  };
};
