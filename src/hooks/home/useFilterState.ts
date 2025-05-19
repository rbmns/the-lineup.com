
import { useState } from 'react';
import { Event } from '@/types';

export const useFilterState = () => {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [aiSearchFilter, setAiSearchFilter] = useState<{
    categories?: string[], 
    location?: string, 
    date_range?: string,
    feedback?: string
  } | null>(null);

  // Toggle event type selection
  const toggleEventType = (eventType: string) => {
    setSelectedEventTypes(prev => {
      if (prev.includes(eventType)) {
        return prev.filter(type => type !== eventType);
      }
      return [...prev, eventType];
    });
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
    resetFilters
  };
};
