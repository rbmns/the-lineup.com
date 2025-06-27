
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
      console.log('useEventsPageData: Fetching events...');
      
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
        console.error('useEventsPageData: Error fetching events:', error);
        throw error;
      }

      console.log(`useEventsPageData: Fetched ${data?.length || 0} events`);
      console.log('useEventsPageData: Sample events:', data?.slice(0, 3)?.map(e => ({
        id: e.id,
        title: e.title,
        status: e.status,
        start_date: e.start_date,
        event_category: e.event_category,
        vibe: e.vibe
      })));

      // If user is authenticated, fetch RSVP status for each event
      if (user?.id && data) {
        const eventIds = data.map(event => event.id);
        
        if (eventIds.length > 0) {
          const { data: rsvpData } = await supabase
            .from('event_rsvps')
            .select('event_id, status')
            .eq('user_id', user.id)
            .in('event_id', eventIds);

          // Map RSVP status to events and log for debugging
          const eventsWithRsvp = data.map(event => {
            const rsvp = rsvpData?.find(r => r.event_id === event.id);
            const eventWithRsvp = {
              ...event,
              rsvp_status: rsvp?.status || null
            };
            
            console.log(`useEventsPageData: Event ${event.id} (${event.title}) RSVP status set to: ${eventWithRsvp.rsvp_status}`);
            return eventWithRsvp;
          });
          
          return eventsWithRsvp;
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

  console.log('useEventsPageData: All event types found:', allEventTypes);

  // Filter out past events first
  const upcomingEvents = eventsData?.filter(event => {
    if (!event.start_date) {
      console.log(`useEventsPageData: Event ${event.id} has no start_date, including it`);
      return true;
    }
    const eventDate = new Date(event.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for comparison
    const isUpcoming = eventDate >= today;
    
    if (!isUpcoming) {
      console.log(`useEventsPageData: Event ${event.id} (${event.title}) is in the past: ${event.start_date}`);
    }
    
    return isUpcoming;
  }) || [];

  console.log(`useEventsPageData: After filtering past events: ${upcomingEvents.length} upcoming events`);

  // Helper function to get cities for a selected area
  const getCitiesForSelectedArea = (areaId: string): string[] => {
    const area = venueAreas.find(area => area.id === areaId);
    return area ? area.cities : [];
  };

  // Filter events based on all criteria
  const filteredEvents = upcomingEvents?.filter(event => {
    console.log(`useEventsPageData: Filtering event ${event.id} (${event.title}):`);
    
    // Vibe filter - only apply if vibes are selected
    if (selectedVibes.length > 0) {
      const eventVibe = event.vibe || 'general';
      if (!selectedVibes.includes(eventVibe)) {
        console.log(`  - Filtered out by vibe: event has '${eventVibe}', selected: [${selectedVibes.join(', ')}]`);
        return false;
      }
      console.log(`  - Passes vibe filter: '${eventVibe}'`);
    }

    // Event type filter - only apply if types are selected
    if (selectedEventTypes.length > 0) {
      const eventCategory = event.event_category || '';
      if (!selectedEventTypes.includes(eventCategory)) {
        console.log(`  - Filtered out by event type: event has '${eventCategory}', selected: [${selectedEventTypes.join(', ')}]`);
        return false;
      }
      console.log(`  - Passes event type filter: '${eventCategory}'`);
    }

    // Venue filter - only apply if venues are selected
    if (selectedVenues.length > 0) {
      const eventVenueId = event.venue_id || '';
      if (!selectedVenues.includes(eventVenueId)) {
        console.log(`  - Filtered out by venue: event has '${eventVenueId}', selected: [${selectedVenues.join(', ')}]`);
        return false;
      }
      console.log(`  - Passes venue filter: '${eventVenueId}'`);
    }

    // Area-based location filter - only apply if location is selected
    if (selectedLocation) {
      // If no venue city or location, exclude this event
      if (!event.venues?.city && !event.location) {
        console.log(`  - Filtered out by location: event has no venue city or location`);
        return false;
      }
      
      // If event has "Location TBD" or similar, exclude it
      if (event.location && (
        event.location.toLowerCase().includes('tbd') || 
        event.location.toLowerCase().includes('to be determined') ||
        event.location.toLowerCase().includes('location tbd')
      )) {
        console.log(`  - Filtered out by location: event has TBD location: '${event.location}'`);
        return false;
      }

      const citiesInArea = getCitiesForSelectedArea(selectedLocation);
      const eventCity = event.venues?.city || event.location;
      
      if (eventCity && !citiesInArea.some(city => 
        city.toLowerCase() === eventCity.toLowerCase()
      )) {
        console.log(`  - Filtered out by location: event city '${eventCity}' not in selected area cities: [${citiesInArea.join(', ')}]`);
        return false;
      }
      console.log(`  - Passes location filter: '${eventCity}'`);
    }

    // Date filter - only apply if date range is set
    if (dateRange?.from && event.start_date) {
      const eventDate = new Date(event.start_date);
      if (eventDate < dateRange.from) {
        console.log(`  - Filtered out by date: event date ${event.start_date} is before ${dateRange.from}`);
        return false;
      }
      if (dateRange.to && eventDate > dateRange.to) {
        console.log(`  - Filtered out by date: event date ${event.start_date} is after ${dateRange.to}`);
        return false;
      }
      console.log(`  - Passes date filter: '${event.start_date}'`);
    }

    console.log(`  - Event passes all filters!`);
    return true;
  }) || [];

  console.log(`useEventsPageData: After all filtering: ${filteredEvents.length} events`);
  console.log('useEventsPageData: Final filtered events:', filteredEvents.map(e => ({
    id: e.id,
    title: e.title,
    event_category: e.event_category,
    vibe: e.vibe,
    start_date: e.start_date
  })));

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
