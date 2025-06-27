
import { useState, useEffect } from 'react';
import { useEvents } from './useEvents';
import { Event } from '@/types';
import { DateRange } from 'react-day-picker';

interface UseEventsFiltersProps {
  initialCategory?: string;
  initialLocation?: string;
  initialDateRange?: DateRange | null;
  initialVibe?: string;
}

export const useEventsFilters = (props: UseEventsFiltersProps) => {
  const [category, setCategory] = useState(props.initialCategory || 'all');
  const [location, setLocation] = useState(props.initialLocation || 'all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(props.initialDateRange || undefined);
  const [vibe, setVibe] = useState(props.initialVibe || 'all');

  const { data: events, isLoading, error, refetch } = useEvents();

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  const handleVibeChange = (newVibe: string) => {
    setVibe(newVibe);
  };

  // Filter events based on current filter values
  const filteredEvents = events?.filter((event: Event) => {
    if (category !== 'all' && event.event_category !== category) {
      return false;
    }
    if (location !== 'all' && event.venue_id !== location) {
      return false;
    }
    if (vibe !== 'all' && event.vibe !== vibe) {
      return false;
    }
    // Add date range filtering if needed
    return true;
  });

  return {
    events: filteredEvents,
    isLoading,
    isError: !!error,
    error,
    refetch,
    category,
    location,
    dateRange,
    vibe,
    handleCategoryChange,
    handleLocationChange,
    handleDateRangeChange,
    handleVibeChange
  };
};
