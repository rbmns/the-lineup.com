
import React, { useMemo, useState, useEffect } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useVenues } from '@/hooks/useVenues';
import { useEventVibes } from '@/hooks/useEventVibes';
import { useAuth } from '@/contexts/AuthContext';
import { useRsvpActions } from '@/hooks/event-rsvp/useRsvpActions';
import { useFilterState } from '@/contexts/FilterStateContext';
import { Event } from '@/types';
import { LocationData } from '@/hooks/useLocation';
import { isEventNearby } from '@/utils/geolocationUtils';

interface EventsDataProviderProps {
  children: (data: {
    filteredEvents: Event[];
    similarEvents: Event[];
    eventsLoading: boolean;
    isVenuesLoading: boolean;
    isFilterLoading: boolean;
    allEventTypes: string[];
    selectedCategories: string[];
    toggleCategory: (type: string) => void;
    selectAll: () => void;
    deselectAll: () => void;
    isNoneSelected: boolean;
    hasActiveFilters: boolean;
    showAdvancedFilters: boolean;
    toggleAdvancedFilters: () => void;
    dateRange: any;
    setDateRange: (range: any) => void;
    selectedDateFilter: string;
    setSelectedDateFilter: (filter: string) => void;
    selectedVenues: string[];
    setSelectedVenues: (venues: string[]) => void;
    venues: Array<{ value: string, label: string }>;
    locations: Array<{ value: string, label: string }>;
    hasAdvancedFilters: boolean;
    handleRemoveVenue: (venue: string) => void;
    handleClearDateFilter: () => void;
    resetFilters: () => void;
    handleRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>;
    showRsvpButtons: boolean;
    loadingEventId: string | null;
    selectedVibes?: string[];
    setSelectedVibes?: (vibes: string[]) => void;
    vibes?: string[];
    vibesLoading?: boolean;
    isFilteredByLocation: boolean;
    userLocation: LocationData | null;
    selectedLocationId: string | null;
    onLocationChange: (id: string | null) => void;
  }) => React.ReactNode;
}

export const EventsDataProvider: React.FC<EventsDataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  // Main events query - show only published events by default (no includeAllStatuses override)
  const { 
    data: allEvents = [], 
    isLoading: eventsLoading, 
    error: eventsError,
    refetch: refetchEvents 
  } = useEvents(user?.id);

  const { venues = [], isLoading: isVenuesLoading } = useVenues();
  const { data: vibes = [], isLoading: vibesLoading } = useEventVibes();
  const { handleRsvp, loading: rsvpLoading } = useRsvpActions(user?.id);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected,
    hasActiveFilters,
    showAdvancedFilters,
    toggleAdvancedFilters,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    selectedVenues,
    setSelectedVenues,
    selectedVibes,
    setSelectedVibes,
    hasAdvancedFilters,
    handleRemoveVenue,
    handleClearDateFilter,
    resetFilters,
    loadingEventId,
    setLoadingEventId
  } = useFilterState();

  // Debug log to track events
  useEffect(() => {
    console.log('🔍 EventsDataProvider - allEvents:', allEvents.length);
    console.log('🔍 EventsDataProvider - sample events:', allEvents.slice(0, 3).map(e => ({
      id: e.id,
      title: e.title,
      status: e.status,
      event_category: e.event_category
    })));
  }, [allEvents]);

  useEffect(() => {
    if (!selectedLocationId) {
      setUserLocation(null);
      return;
    }

    const eventAtVenue = allEvents.find(e => e.venue_id === selectedLocationId && e.coordinates);
    if (eventAtVenue && eventAtVenue.coordinates) {
      const venueName = venues.find(v => v.id === selectedLocationId)?.name || 'selected area';
      const [longitude, latitude] = eventAtVenue.coordinates;
      setUserLocation({
        location: venueName,
        latitude,
        longitude,
      });
    } else {
      setUserLocation(null);
    }
  }, [selectedLocationId, allEvents, venues]);

  // Get all unique event types
  const allEventTypes = useMemo(() => {
    if (!allEvents) return [];
    const types = Array.from(new Set(
      allEvents
        .filter(event => event.event_category)
        .map(event => event.event_category as string)
    )).sort();
    console.log('🔍 EventsDataProvider - allEventTypes:', types);
    return types;
  }, [allEvents]);

  // Enhanced RSVP handler
  const enhancedHandleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    setLoadingEventId(eventId);
    try {
      return await handleRsvp(eventId, status);
    } finally {
      setLoadingEventId(null);
    }
  };

  // Filter events based on all selected filters including vibes
  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];
    
    console.log('🔍 Starting filteredEvents calculation with', allEvents.length, 'events');
    console.log('🔍 selectedCategories:', selectedCategories);
    console.log('🔍 allEventTypes:', allEventTypes);
    
    let tempFilteredEvents = [...allEvents];

    // New location filter
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      tempFilteredEvents = tempFilteredEvents.filter(event => {
        if (!event.coordinates) {
          return false;
        }

        const [longitude, latitude] = event.coordinates;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          return false;
        }
        
        return isEventNearby(
          { latitude, longitude },
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          50 // 50km radius
        );
      });
    }

    const result = tempFilteredEvents.filter((event) => {
      // Simplified category filter logic:
      // If no categories are selected (empty array), show all events
      // If specific categories are selected, filter by those categories only
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(event.event_category || '')) {
          return false;
        }
      }
      
      // Venue filter
      if (selectedVenues.length > 0 && !selectedVenues.includes(event.venue_id || '')) {
        return false;
      }
      
      // Vibe filter - only filter if vibes are selected (not empty)
      if (selectedVibes && selectedVibes.length > 0) {
        if (!selectedVibes.includes(event.vibe || '')) {
          return false;
        }
      }
      
      // Date filter logic
      if (dateRange?.from) {
        const eventDate = new Date(event.start_date || '');
        const fromDate = new Date(dateRange.from);
        const toDate = dateRange.to ? new Date(dateRange.to) : fromDate;
        
        if (eventDate < fromDate || eventDate > toDate) {
          return false;
        }
      }
      
      // Quick date filters
      if (selectedDateFilter) {
        const today = new Date();
        const eventDate = new Date(event.start_date || '');
        
        switch (selectedDateFilter) {
          case 'today':
            if (eventDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (eventDate.toDateString() !== tomorrow.toDateString()) return false;
            break;
          case 'this-weekend':
            const dayOfWeek = today.getDay();
            const daysUntilSaturday = (6 - dayOfWeek) % 7;
            const saturday = new Date(today);
            saturday.setDate(today.getDate() + daysUntilSaturday);
            const sunday = new Date(saturday);
            sunday.setDate(saturday.getDate() + 1);
            
            if (eventDate.toDateString() !== saturday.toDateString() && 
                eventDate.toDateString() !== sunday.toDateString()) return false;
            break;
        }
      }
      
      return true;
    });
    
    console.log('🔍 filteredEvents result:', result.length, 'events');
    console.log('🔍 Filter state:', {
      selectedCategories: selectedCategories.length,
      selectedVenues: selectedVenues.length,
      selectedVibes: selectedVibes?.length || 0,
      hasDateFilter: !!dateRange || !!selectedDateFilter
    });
    
    return result;
  }, [allEvents, selectedCategories, selectedVenues, selectedVibes, dateRange, selectedDateFilter, userLocation, allEventTypes]);

  // Format venues for the component
  const formattedVenues = venues.map(venue => ({
    value: venue.id,
    label: venue.name
  }));

  const isFilterLoading = vibesLoading;

  const fullResetFilters = () => {
    resetFilters();
    setSelectedLocationId(null);
  }

  return children({
    filteredEvents,
    similarEvents: [], // Can be implemented later
    eventsLoading,
    isVenuesLoading,
    isFilterLoading,
    allEventTypes,
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected,
    hasActiveFilters,
    showAdvancedFilters,
    toggleAdvancedFilters,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    selectedVenues,
    setSelectedVenues,
    venues: formattedVenues,
    locations: formattedVenues, // Using venues as locations for now
    hasAdvancedFilters,
    handleRemoveVenue,
    handleClearDateFilter,
    resetFilters: fullResetFilters,
    handleRsvp: enhancedHandleRsvp,
    showRsvpButtons: !!user,
    loadingEventId,
    selectedVibes,
    setSelectedVibes,
    vibes,
    vibesLoading,
    isFilteredByLocation: !!userLocation,
    userLocation,
    selectedLocationId,
    onLocationChange: setSelectedLocationId,
  });
};
