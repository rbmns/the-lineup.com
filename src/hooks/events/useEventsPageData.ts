
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useFilteredEvents } from './useFilteredEvents';
import { useVenueFilter } from './useVenueFilter';
import { useUrlFilters } from './useUrlFilters';
import { DateRange } from 'react-day-picker';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { filterUpcomingEvents } from '@/utils/date-filtering';
import { useAuth } from '@/contexts/AuthContext';

export const useEventsPageData = () => {
  const { user } = useAuth();
  
  // State for filters - these will be synced with URL
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

  // Integrate URL filters for state persistence
  useUrlFilters(
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    selectedVibes,
    setSelectedVibes,
    selectedLocation,
    setSelectedLocation
  );

  // Fetch events with RSVP status
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events-page-data', user?.id],
    queryFn: async () => {
      // First get events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('start_datetime', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        throw eventsError;
      }

      if (!events || events.length === 0) {
        return [];
      }

      // Get all unique venue IDs and creator IDs
      const venueIds = [...new Set(events.map(e => e.venue_id).filter(Boolean))];
      const creatorIds = [...new Set(events.map(e => e.creator || e.created_by).filter(Boolean))];
      const eventIds = events.map(e => e.id);

      // Fetch venues separately
      let venues = [];
      if (venueIds.length > 0) {
        const { data: venuesData } = await supabase
          .from('venues')
          .select('*')
          .in('id', venueIds);
        venues = venuesData || [];
      }

      // Fetch creators separately
      let creators = [];
      if (creatorIds.length > 0) {
        const { data: creatorsData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', creatorIds);
        creators = creatorsData || [];
      }

      // Fetch user's RSVP status if authenticated
      let userRsvps = [];
      if (user?.id && eventIds.length > 0) {
        const { data: rsvpData } = await supabase
          .from('event_rsvps')
          .select('event_id, status')
          .eq('user_id', user.id)
          .in('event_id', eventIds);
        userRsvps = rsvpData || [];
      }

      // Create RSVP status map
      const rsvpMap: { [eventId: string]: 'Going' | 'Interested' } = {};
      userRsvps.forEach(rsvp => {
        rsvpMap[rsvp.event_id] = rsvp.status as 'Going' | 'Interested';
      });

      // Combine the data
      const eventsWithRelations = events.map(event => ({
        ...event,
        venues: venues.find(v => v.id === event.venue_id) || null,
        creator: creators.find(c => c.id === (event.creator || event.created_by)) || null,
        rsvp_status: rsvpMap[event.id] || null
      }));

      // Filter out past events before returning
      return filterUpcomingEvents(eventsWithRelations);
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
