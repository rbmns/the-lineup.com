
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { useEventVibes } from '@/hooks/useEventVibes';
import { supabase } from '@/lib/supabase';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { useFilteredEvents } from '@/hooks/events/useFilteredEvents';

export const useEventsPageData = () => {
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const { data: vibes = [], isLoading: vibesLoading } = useEventVibes();
  const [venues, setVenues] = useState<Array<{ value: string, label: string }>>([]);
  const [isVenuesLoading, setIsVenuesLoading] = useState(true);
  
  // Get all unique event types from events
  const allEventTypes = useMemo(() => {
    const types = events.map(event => event.event_category).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
  // Event filter state management
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    selectedVibes,
    setSelectedVibes,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    hasActiveFilters,
    resetFilters,
  } = useEventFilterState();
  
  // Fetch all venues for the filter
  useEffect(() => {
    const fetchVenues = async () => {
      setIsVenuesLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          const venueOptions = data.map(venue => ({
            value: venue.id,
            label: venue.name
          }));
          setVenues(venueOptions);
        }
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setIsVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);
  
  // Use the filtered events hook - pass selectedEventTypes as selectedCategories
  const filteredEvents = useFilteredEvents({
    events,
    selectedCategories: selectedEventTypes,
    allEventTypes,
    selectedVenues,
    selectedVibes,
    dateRange,
    selectedDateFilter
  });

  const { 
    handleRsvp: enhancedHandleRsvp, 
    loadingEventId
  } = useEnhancedRsvp(user?.id);
  
  return {
    user,
    events,
    eventsLoading,
    filteredEvents,
    venues,
    isVenuesLoading,
    allEventTypes,
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    selectedVibes,
    setSelectedVibes,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    hasActiveFilters,
    resetFilters,
    enhancedHandleRsvp,
    loadingEventId,
    vibes,
    vibesLoading
  };
};
