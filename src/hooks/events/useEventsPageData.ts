
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useFilteredEvents } from './useFilteredEvents';
import { useVenueFilter } from './useVenueFilter';
import { DateRange } from 'react-day-picker';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { useVenueAreas } from '@/hooks/useVenueAreas';

export const useEventsPageData = () => {
  // State for filters
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  // Get venue areas for location filtering
  const { data: venueAreas = [] } = useVenueAreas();

  // Set location loaded when venue areas are available
  useEffect(() => {
    if (venueAreas.length > 0) {
      setIsLocationLoaded(true);
    }
  }, [venueAreas]);

  // Venue filter hook
  const {
    selectedVenues,
    setSelectedVenues,
    availableVenues,
    isLoading: venuesLoading
  } = useVenueFilter();

  // Fetch events with proper joins
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events-page-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles!events_creator_fkey(*),
          venues(*)
        `)
        .eq('status', 'published')
        .order('start_datetime', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Process events data
  const allEvents = useMemo(() => {
    if (!eventsData) return [];
    return processEventsData(eventsData);
  }, [eventsData]);

  // Filter events using the updated hook that includes location filtering
  const filteredEvents = useFilteredEvents({
    events: allEvents,
    selectedCategories: selectedEventTypes,
    allEventTypes: [...new Set(allEvents.map(event => event.event_category).filter(Boolean))],
    selectedVenues,
    selectedVibes,
    dateRange,
    selectedDateFilter,
    selectedLocation,
    venueAreas
  });

  // Get available event types
  const allEventTypes = useMemo(() => {
    if (!allEvents) return [];
    const categories = allEvents
      .map(event => event.event_category)
      .filter((category): category is string => Boolean(category));
    return [...new Set(categories)].sort();
  }, [allEvents]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return selectedEventTypes.length > 0 ||
           selectedVibes.length > 0 ||
           selectedVenues.length > 0 ||
           selectedLocation !== null ||
           dateRange !== undefined ||
           (selectedDateFilter && selectedDateFilter !== '');
  }, [selectedEventTypes, selectedVibes, selectedVenues, selectedLocation, dateRange, selectedDateFilter]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVibes([]);
    setSelectedVenues([]);
    setSelectedLocation(null);
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  const isLoading = eventsLoading || venuesLoading;

  return {
    events: filteredEvents,
    allEvents,
    isLoading,
    selectedVibes,
    selectedEventTypes,
    selectedVenues,
    selectedLocation,
    dateRange,
    selectedDateFilter,
    setSelectedVibes,
    setSelectedEventTypes,
    setSelectedVenues,
    setSelectedLocation,
    setDateRange,
    setSelectedDateFilter,
    allEventTypes,
    availableVenues,
    hasActiveFilters,
    resetAllFilters,
    isLocationLoaded
  };
};
