
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { useRsvpStateManager } from './useRsvpStateManager';

export const useEventsPageData = () => {
  const { user } = useAuth();
  
  // Filter states - START WITH EMPTY to show all events initially
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('anytime');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // RSVP functionality - keep all existing logic
  const { handleRsvp, isProcessing, loadingEventId } = useRsvpStateManager(user?.id);
  const rsvpInProgressRef = useRef<boolean>(false);

  // Fixed events query - specify the correct foreign key relationship
  const { data: allEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues!events_venue_id_fkey(*),
          event_rsvps(status, user_id)
        `)
        .gte('start_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return (data || []).map(event => ({
        ...event,
        rsvp_status: user 
          ? event.event_rsvps?.find(rsvp => rsvp.user_id === user.id)?.status || null
          : null,
        going_count: event.event_rsvps?.filter(rsvp => rsvp.status === 'Going').length || 0,
        interested_count: event.event_rsvps?.filter(rsvp => rsvp.status === 'Interested').length || 0,
      })) as Event[];
    },
    enabled: true
  });

  // Keep vibes query unchanged
  const { data: vibes = [], isLoading: vibesLoading } = useQuery({
    queryKey: ['vibes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('event_category')
        .not('event_category', 'is', null);

      if (error) throw error;
      
      const uniqueVibes = [...new Set(data?.map(item => item.event_category).filter(Boolean) || [])];
      return uniqueVibes;
    }
  });

  // Keep event types query unchanged - using event_category instead of event_type
  const { data: allEventTypes = [] } = useQuery({
    queryKey: ['event-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('event_category')
        .not('event_category', 'is', null);

      if (error) throw error;
      
      const uniqueTypes = [...new Set(data?.map(item => item.event_category).filter(Boolean) || [])];
      return uniqueTypes;
    }
  });

  // Load actual venues from the database
  const { data: availableVenues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  // FIXED: Enhanced filtering logic - show all events by default, filter only when filters are applied
  const filteredEvents = useMemo(() => {
    let filtered = [...allEvents];

    // Only apply vibe filtering if vibes are specifically selected
    if (selectedVibes.length > 0) {
      filtered = filtered.filter(event => 
        event.event_category && selectedVibes.includes(event.event_category)
      );
    }

    // Only apply event type filtering if types are specifically selected
    if (selectedEventTypes.length > 0) {
      filtered = filtered.filter(event => 
        event.event_category && selectedEventTypes.includes(event.event_category)
      );
    }

    // Only apply venue filtering if venues are specifically selected
    if (selectedVenues.length > 0) {
      filtered = filtered.filter(event => 
        event.venue_id && selectedVenues.includes(event.venue_id)
      );
    }

    // Only apply date filtering if a date range or specific date filter is selected
    if (dateRange?.from) {
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to ? dateRange.to.toISOString().split('T')[0] : fromDate;
      
      filtered = filtered.filter(event => {
        if (!event.start_date) return false;
        const eventDate = event.start_date.split('T')[0];
        return eventDate >= fromDate && eventDate <= toDate;
      });
    }

    if (selectedDateFilter !== 'anytime') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(event => {
        if (!event.start_date) return false;
        const eventDate = new Date(event.start_date.split('T')[0]);
        
        switch (selectedDateFilter) {
          case 'today':
            return eventDate.getTime() === today.getTime();
          case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return eventDate.getTime() === tomorrow.getTime();
          case 'this-weekend':
            const dayOfWeek = now.getDay();
            const daysUntilSaturday = (6 - dayOfWeek) % 7;
            const saturday = new Date(today);
            saturday.setDate(today.getDate() + daysUntilSaturday);
            const sunday = new Date(saturday);
            sunday.setDate(saturday.getDate() + 1);
            return eventDate.getTime() === saturday.getTime() || eventDate.getTime() === sunday.getTime();
          case 'next-week':
            const dayOfWeekForNext = now.getDay();
            const daysUntilNextMonday = ((7 - dayOfWeekForNext) % 7) + 1;
            const nextMonday = new Date(today);
            nextMonday.setDate(today.getDate() + daysUntilNextMonday);
            const nextSunday = new Date(nextMonday);
            nextSunday.setDate(nextMonday.getDate() + 6);
            return eventDate >= nextMonday && eventDate <= nextSunday;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allEvents, selectedVibes, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter]);

  // Keep all existing RSVP logic unchanged
  const enhancedHandleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user) {
      console.log('User not authenticated, cannot RSVP');
      return false;
    }

    if (rsvpInProgressRef.current) {
      console.log('RSVP already in progress');
      return false;
    }

    try {
      rsvpInProgressRef.current = true;
      const result = await handleRsvp(eventId, status);
      return result;
    } catch (error) {
      console.error('Error in enhanced RSVP handler:', error);
      return false;
    } finally {
      setTimeout(() => {
        rsvpInProgressRef.current = false;
      }, 500);
    }
  }, [user, handleRsvp]);

  // Fix the hasActiveFilters logic to properly handle boolean types
  const hasActiveFilters = selectedVibes.length > 0 || 
                          selectedEventTypes.length > 0 || 
                          selectedVenues.length > 0 || 
                          (dateRange?.from !== undefined) || 
                          selectedDateFilter !== 'anytime';

  const resetFilters = useCallback(() => {
    setSelectedVibes([]);
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRange(undefined);
    setSelectedDateFilter('anytime');
  }, []);

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
    allEventTypes,
    availableVenues
  };
};
