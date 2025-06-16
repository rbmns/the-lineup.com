
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useVenues } from '@/hooks/useVenues';
import { useEventVibes } from '@/hooks/useEventVibes';
import { useAuth } from '@/contexts/AuthContext';
import { useRsvpActions } from '@/hooks/event-rsvp/useRsvpActions';
import { useFilterState } from '@/contexts/FilterStateContext';
import { Event } from '@/types';
import { useMemo } from 'react';

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
  }) => React.ReactNode;
}

export const EventsDataProvider: React.FC<EventsDataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const { venues = [], isLoading: isVenuesLoading } = useVenues();
  const { data: vibes = [], isLoading: vibesLoading } = useEventVibes();
  const { handleRsvp, loading: rsvpLoading } = useRsvpActions(user?.id);
  
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

  // Get all unique event types
  const allEventTypes = useMemo(() => {
    if (!events) return [];
    return Array.from(new Set(
      events
        .filter(event => event.event_category)
        .map(event => event.event_category as string)
    )).sort();
  }, [events]);

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
    if (!events) return [];
    
    return events.filter((event) => {
      // Event type filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(event.event_category || '')) {
        return false;
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
  }, [events, selectedCategories, selectedVenues, selectedVibes, dateRange, selectedDateFilter]);

  // Format venues for the component
  const formattedVenues = venues.map(venue => ({
    value: venue.id,
    label: venue.name
  }));

  const isFilterLoading = vibesLoading;

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
    resetFilters,
    handleRsvp: enhancedHandleRsvp,
    showRsvpButtons: !!user,
    loadingEventId,
    selectedVibes,
    setSelectedVibes,
    vibes,
    vibesLoading
  });
};
