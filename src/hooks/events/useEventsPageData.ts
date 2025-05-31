
import { useState, useEffect, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { useRsvpActions } from '@/hooks/event-rsvp/useRsvpActions';
import { useEventVibes } from '@/hooks/useEventVibes';
import { Event } from '@/types';
import { DateRange } from 'react-day-picker';

export const useEventsPageData = () => {
  const { user } = useAuth();
  const { data: events, isLoading: eventsLoading } = useEvents(user?.id);
  const { data: vibes = [], isLoading: vibesLoading } = useEventVibes();
  const { handleRsvp, loading: rsvpLoading } = useRsvpActions(user?.id);
  
  // Filter states
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  // Get all unique event types
  const allEventTypes = useMemo(() => {
    if (!events) return [];
    return Array.from(new Set(
      events
        .filter(event => event.event_category)
        .map(event => event.event_category as string)
    )).sort();
  }, [events]);

  // Filter events based on all selected filters
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter((event) => {
      // Event type filter
      if (selectedEventTypes.length > 0 && !selectedEventTypes.includes(event.event_category || '')) {
        return false;
      }
      
      // Venue filter
      if (selectedVenues.length > 0 && !selectedVenues.includes(event.venue_id || '')) {
        return false;
      }
      
      // Vibe filter - now working with the vibe column
      if (selectedVibes.length > 0 && !selectedVibes.includes(event.vibe || '')) {
        return false;
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
          // Add other date filter cases as needed
        }
      }
      
      return true;
    });
  }, [events, selectedEventTypes, selectedVenues, selectedVibes, dateRange, selectedDateFilter]);

  // Check if any filters are active
  const hasActiveFilters = selectedEventTypes.length > 0 || 
                          selectedVenues.length > 0 || 
                          selectedVibes.length > 0 || 
                          !!dateRange || 
                          !!selectedDateFilter;

  // Enhanced RSVP handler
  const enhancedHandleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    setLoadingEventId(eventId);
    try {
      await handleRsvp(eventId, status);
    } finally {
      setLoadingEventId(null);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setSelectedVibes([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  const isFilterLoading = vibesLoading;

  return {
    filteredEvents,
    eventsLoading,
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
    vibesLoading,
    allEventTypes
  };
};
