
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { DateRange } from 'react-day-picker';
import { useRsvpStateManager } from './useRsvpStateManager';

export const useEventsPageData = () => {
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
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

    // Location filter (by venue city)
    if (selectedLocation && event.venues?.city !== selectedLocation) {
      return false;
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

  const { updateEventRsvp } = useRsvpStateManager(filteredEvents);

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
    updateEventRsvp
  };
};
