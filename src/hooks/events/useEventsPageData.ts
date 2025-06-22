
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { DateRange } from 'react-day-picker';
import { useRsvpStateManager } from './useRsvpStateManager';
import { useAuth } from '@/contexts/AuthContext';
import { getCitiesForCategory } from '@/utils/locationCategories';

export const useEventsPageData = () => {
  const { user } = useAuth();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null); // Now stores category ID
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('anytime');

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues!events_venue_id_fkey (
            id,
            name,
            city,
            street,
            postal_code
          )
        `)
        .eq('status', 'published')
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data;
    },
  });

  // Get available venues for filtering
  const { data: availableVenues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('id, name, city')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Get all event types/categories for advanced filtering
  const allEventTypes = [
    ...new Set(eventsData?.map(event => event.event_category).filter(Boolean))
  ] as string[];

  // Filter events based on all criteria
  const filteredEvents = eventsData?.filter(event => {
    // Vibe filter
    if (selectedVibes.length > 0 && !selectedVibes.includes(event.vibe || 'general')) {
      return false;
    }

    // Event type filter
    if (selectedEventTypes.length > 0 && !selectedEventTypes.includes(event.event_category || '')) {
      return false;
    }

    // Venue filter
    if (selectedVenues.length > 0 && !selectedVenues.includes(event.venue_id || '')) {
      return false;
    }

    // Location category filter (by venue city)
    if (selectedLocation && event.venues?.city) {
      const citiesInCategory = getCitiesForCategory(selectedLocation);
      if (!citiesInCategory.some(city => 
        city.toLowerCase() === event.venues.city.toLowerCase()
      )) {
        return false;
      }
    }

    // Date filter
    if (dateRange?.from && event.start_date) {
      const eventDate = new Date(event.start_date);
      if (eventDate < dateRange.from) {
        return false;
      }
      if (dateRange.to && eventDate > dateRange.to) {
        return false;
      }
    }

    return true;
  }) || [];

  // Use RSVP state manager with the user ID
  const rsvpManager = useRsvpStateManager(user?.id);

  const hasActiveFilters = selectedVibes.length > 0 || 
                          selectedEventTypes.length > 0 || 
                          selectedVenues.length > 0 || 
                          selectedLocation !== null ||
                          !!dateRange || 
                          selectedDateFilter !== 'anytime';

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
    isLoading: eventsLoading,
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
    updateEventRsvp: rsvpManager.handleRsvp
  };
};
