
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { DateRange } from 'react-day-picker';
import { useRsvpStateManager } from './useRsvpStateManager';
import { useAuth } from '@/contexts/AuthContext';
import { useLocationPreference } from '@/hooks/useLocationPreference';
import { convertAreasToCategories } from '@/utils/locationCategories';

export const useEventsPageData = () => {
  const { user, profile } = useAuth();
  const { selectedAreaId, updateLocationPreference, isLoaded } = useLocationPreference();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('anytime');

  // Use the persistent location preference as the selected location
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Sync with location preference when loaded
  useEffect(() => {
    if (isLoaded) {
      setSelectedLocation(selectedAreaId);
    }
  }, [selectedAreaId, isLoaded]);

  // Custom location change handler that persists the preference
  const handleLocationChange = (areaId: string | null) => {
    setSelectedLocation(areaId);
    updateLocationPreference(areaId);
  };

  // Fetch events with RSVP status for authenticated users
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      let query = supabase
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

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      // If user is authenticated, fetch RSVP status for each event
      if (user?.id && data) {
        const eventIds = data.map(event => event.id);
        
        if (eventIds.length > 0) {
          const { data: rsvpData } = await supabase
            .from('event_rsvps')
            .select('event_id, status')
            .eq('user_id', user.id)
            .in('event_id', eventIds);

          // Map RSVP status to events
          return data.map(event => {
            const rsvp = rsvpData?.find(r => r.event_id === event.id);
            return {
              ...event,
              rsvp_status: rsvp?.status || null
            };
          });
        }
      }

      return data || [];
    },
    staleTime: 1000 * 30, // 30 seconds for fresh data
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

  // Fetch venue city areas for area filtering
  const { data: cityAreas = [] } = useQuery({
    queryKey: ['venue-city-areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venue_city_areas')
        .select('area_id, city_name');

      if (error) {
        console.error('Error fetching venue city areas:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Fetch venue areas and convert to proper format with cities
  const { data: venueAreas = [] } = useQuery({
    queryKey: ['venue-areas-with-cities'],
    queryFn: async () => {
      // Fetch areas
      const { data: areas, error: areasError } = await supabase
        .from('venue_areas')
        .select('id, name')
        .order('display_order', { ascending: true });

      if (areasError) {
        console.error('Error fetching venue areas:', areasError);
        throw areasError;
      }

      // Fetch city mappings
      const { data: cityMappings, error: cityError } = await supabase
        .from('venue_city_areas')
        .select('area_id, city_name');

      if (cityError) {
        console.error('Error fetching venue city areas:', cityError);
        throw cityError;
      }

      // Convert to LocationCategory format with cities
      return convertAreasToCategories(areas || [], cityMappings || []);
    },
  });

  // Auto-set location based on user's profile location
  useEffect(() => {
    if (user && profile && profile.location && isLoaded && !selectedAreaId && venueAreas.length > 0 && cityAreas.length > 0) {
      // Find if user's location matches any city in the venue areas
      const userCity = profile.location;
      const matchingCityArea = cityAreas.find(cityArea => 
        cityArea.city_name.toLowerCase() === userCity.toLowerCase()
      );
      
      if (matchingCityArea) {
        console.log('Auto-setting location filter based on user profile:', userCity, 'to area:', matchingCityArea.area_id);
        handleLocationChange(matchingCityArea.area_id);
      }
    }
  }, [user, profile, isLoaded, selectedAreaId, venueAreas, cityAreas]);

  // Get all event types/categories for advanced filtering
  const allEventTypes = [
    ...new Set(eventsData?.map(event => event.event_category).filter(Boolean))
  ] as string[];

  // Filter out past events first
  const upcomingEvents = eventsData?.filter(event => {
    if (!event.start_date) return true;
    const eventDate = new Date(event.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for comparison
    return eventDate >= today;
  }) || [];

  // Helper function to get cities for a selected area
  const getCitiesForSelectedArea = (areaId: string): string[] => {
    const area = venueAreas.find(area => area.id === areaId);
    return area ? area.cities : [];
  };

  // Filter events based on all criteria
  const filteredEvents = upcomingEvents?.filter(event => {
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

    // Area-based location filter
    if (selectedLocation) {
      // If no venue city or location, exclude this event
      if (!event.venues?.city && !event.location) {
        return false;
      }
      
      // If event has "Location TBD" or similar, exclude it
      if (event.location && (
        event.location.toLowerCase().includes('tbd') || 
        event.location.toLowerCase().includes('to be determined') ||
        event.location.toLowerCase().includes('location tbd')
      )) {
        return false;
      }

      const citiesInArea = getCitiesForSelectedArea(selectedLocation);
      const eventCity = event.venues?.city || event.location;
      
      if (eventCity && !citiesInArea.some(city => 
        city.toLowerCase() === eventCity.toLowerCase()
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
    handleLocationChange(null);
    setDateRange(undefined);
    setSelectedDateFilter('anytime');
  };

  return {
    events: filteredEvents,
    allEvents: upcomingEvents, // Return upcoming events only for vibe detection
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
    setSelectedLocation: handleLocationChange,
    setDateRange,
    setSelectedDateFilter,
    allEventTypes,
    availableVenues,
    hasActiveFilters,
    resetAllFilters,
    updateEventRsvp: rsvpManager.handleRsvp,
    isLocationLoaded: isLoaded
  };
};
