
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { filterUpcomingEvents } from '@/utils/date-filtering';
import { DateRange } from 'react-day-picker';

export const useEventsPageData = () => {
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('anytime');
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  // Load location preference from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation && savedLocation !== 'null') {
      setSelectedLocation(savedLocation);
    }
    setIsLocationLoaded(true);
    console.log('Location preference loaded:', savedLocation);
  }, []);

  // Save location preference to localStorage
  useEffect(() => {
    if (isLocationLoaded) {
      if (selectedLocation) {
        localStorage.setItem('selectedLocation', selectedLocation);
      } else {
        localStorage.removeItem('selectedLocation');
      }
    }
  }, [selectedLocation, isLocationLoaded]);

  // Fetch all events with proper column names
  const { data: allEvents, isLoading, error } = useQuery({
    queryKey: ['events-page-data'],
    queryFn: async () => {
      try {
        console.log('useEventsPageData: Fetching events...');
        
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            venues!events_venue_id_fkey(*)
          `)
          .eq('status', 'published')
          .order('start_datetime', { ascending: true });

        if (error) {
          console.error('useEventsPageData: Error fetching events:', error);
          throw error;
        }

        if (!data) {
          console.log('useEventsPageData: No events found');
          return [];
        }

        console.log('useEventsPageData: Raw events from database:', data.length);

        // Fetch creator profiles separately
        const creatorIds = data.map(event => event.creator).filter(Boolean);
        let creatorsData = [];
        
        if (creatorIds.length > 0) {
          const { data: creators, error: creatorsError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, email, location, status, tagline')
            .in('id', creatorIds);
            
          if (!creatorsError && creators) {
            creatorsData = creators;
          }
        }

        // Combine events with creators
        const eventsWithCreators = data.map(event => ({
          ...event,
          creator: creatorsData.find(creator => creator.id === event.creator) || null
        }));

        // Process events data
        const processedEvents = processEventsData(eventsWithCreators);
        console.log('useEventsPageData: Processed events:', processedEvents.length);

        return processedEvents;
      } catch (error) {
        console.error('useEventsPageData: Error in query:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Filter events to only show upcoming ones
  const upcomingEvents = useMemo(() => {
    if (!allEvents || allEvents.length === 0) {
      console.log('useEventsPageData: No events to filter');
      return [];
    }

    const filtered = filterUpcomingEvents(allEvents);
    console.log('useEventsPageData: After filtering past events:', filtered.length, 'upcoming events');
    return filtered;
  }, [allEvents]);

  // Apply all filters
  const filteredEvents = useMemo(() => {
    if (!upcomingEvents || upcomingEvents.length === 0) {
      console.log('useEventsPageData: No upcoming events to filter');
      return [];
    }

    let result = [...upcomingEvents];

    // Apply vibe filter
    if (selectedVibes.length > 0) {
      result = result.filter(event => 
        event.vibe && selectedVibes.includes(event.vibe)
      );
    }

    // Apply event type filter
    if (selectedEventTypes.length > 0) {
      result = result.filter(event => 
        event.event_category && selectedEventTypes.includes(event.event_category)
      );
    }

    // Apply venue filter
    if (selectedVenues.length > 0) {
      result = result.filter(event => 
        event.venue_id && selectedVenues.includes(event.venue_id)
      );
    }

    // Apply location filter - Fixed to work with venue_city_areas
    if (selectedLocation) {
      result = result.filter(event => {
        const eventCity = event.venues?.city || event.destination;
        if (!eventCity) return false;
        
        // This will be handled by the parent component with venue areas data
        // For now, we'll let the parent handle this filtering
        return true;
      });
    }

    // Apply date filters
    if (dateRange || (selectedDateFilter && selectedDateFilter !== 'anytime')) {
      result = result.filter(event => {
        if (!event.start_datetime) return false;
        
        const eventDate = new Date(event.start_datetime);
        const now = new Date();
        
        // Ensure event is not in the past
        if (eventDate < now) return false;
        
        // Custom date range
        if (dateRange?.from) {
          if (eventDate < dateRange.from) return false;
          if (dateRange.to && eventDate > dateRange.to) return false;
          return true;
        }
        
        // Predefined filters
        if (selectedDateFilter && selectedDateFilter !== 'anytime') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          switch (selectedDateFilter) {
            case 'today':
              const todayEnd = new Date(today);
              todayEnd.setHours(23, 59, 59, 999);
              return eventDate >= today && eventDate <= todayEnd;
              
            case 'tomorrow':
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const tomorrowEnd = new Date(tomorrow);
              tomorrowEnd.setHours(23, 59, 59, 999);
              return eventDate >= tomorrow && eventDate <= tomorrowEnd;
              
            case 'this week':
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() - today.getDay());
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 6);
              weekEnd.setHours(23, 59, 59, 999);
              return eventDate >= weekStart && eventDate <= weekEnd;
              
            case 'this weekend':
              const dayOfWeek = today.getDay();
              const daysUntilSaturday = (6 - dayOfWeek) % 7;
              const saturday = new Date(today);
              saturday.setDate(today.getDate() + daysUntilSaturday);
              const sunday = new Date(saturday);
              sunday.setDate(saturday.getDate() + 1);
              sunday.setHours(23, 59, 59, 999);
              return eventDate >= saturday && eventDate <= sunday;
              
            case 'next week':
              const nextWeekStart = new Date(today);
              nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
              const nextWeekEnd = new Date(nextWeekStart);
              nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
              nextWeekEnd.setHours(23, 59, 59, 999);
              return eventDate >= nextWeekStart && eventDate <= nextWeekEnd;
              
            default:
              return true;
          }
        }
        
        return true;
      });
    }

    console.log('useEventsPageData: After all filtering:', result.length, 'events');
    return result;
  }, [upcomingEvents, selectedVibes, selectedEventTypes, selectedVenues, selectedLocation, dateRange, selectedDateFilter]);

  // Extract available options from all events
  const { allEventTypes, availableVenues } = useMemo(() => {
    if (!allEvents || allEvents.length === 0) {
      console.log('useEventsPageData: All event types found:', []);
      return { allEventTypes: [], availableVenues: [] };
    }

    const eventTypes = [...new Set(allEvents.map(event => event.event_category).filter(Boolean))];
    const venues = [...new Set(allEvents
      .filter(event => event.venues?.name && event.venue_id)
      .map(event => ({ id: event.venue_id, name: event.venues?.name }))
      .filter(Boolean))];

    console.log('useEventsPageData: All event types found:', eventTypes);
    return { allEventTypes: eventTypes, availableVenues: venues };
  }, [allEvents]);

  const hasActiveFilters = selectedVibes.length > 0 || 
                          selectedEventTypes.length > 0 || 
                          selectedVenues.length > 0 || 
                          selectedLocation !== null || 
                          dateRange !== undefined || 
                          (selectedDateFilter && selectedDateFilter !== 'anytime');

  const resetAllFilters = () => {
    setSelectedVibes([]);
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setSelectedLocation(null);
    setDateRange(undefined);
    setSelectedDateFilter('anytime');
  };

  return {
    events: filteredEvents,
    allEvents: upcomingEvents,
    isLoading,
    error,
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
