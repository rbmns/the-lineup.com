import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { filterEventsByType, filterEventsByVenue } from '@/utils/eventUtils';
import { filterEventsByDate } from '@/utils/date-filtering';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

export const useEventFiltersLogic = (
  events: Event[] | undefined = [],
  userId: string | undefined = undefined,
  selectedEventTypes: string[] = [],
  selectedVenues: string[] = [],
  dateRange: DateRange | undefined = undefined,
  selectedDateFilter: string = ''
) => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter events based on selected criteria
  useEffect(() => {
    // If no events, set filteredEvents to empty array
    if (!events || events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    // Apply client-side filters by default
    applyClientSideFilters();

    // If we have specific filters and a user ID, we can try to use server-side filtering
    if (userId && (selectedEventTypes.length > 0 || selectedVenues.length > 0 || dateRange || selectedDateFilter)) {
      applyServerSideFilters();
    }
  }, [events, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, userId]);

  // Apply client-side filters only
  const applyClientSideFilters = () => {
    // Log the current filters and events count for debugging
    console.info(`Base events count for filtering: ${events?.length}`);

    let result = [...(events || [])];

    // Apply event type filter
    if (selectedEventTypes.length > 0) {
      result = filterEventsByType(result, selectedEventTypes);
    }

    // Apply venue filter
    if (selectedVenues.length > 0) {
      result = filterEventsByVenue(result, selectedVenues);
    }

    // Apply date filter based on selected option or date range
    if (dateRange || selectedDateFilter) {
      result = filterEventsByDate(result, selectedDateFilter, dateRange);
    }

    // Update state with filtered events
    setFilteredEvents(result);
  };

  // Apply server-side filters
  const applyServerSideFilters = async () => {
    try {
      setIsLoading(true);
      
      // Start building the query
      let query = supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `);

      // Apply event type filter
      if (selectedEventTypes.length > 0) {
        query = query.in('event_type', selectedEventTypes);
      }

      // Apply venue filter
      if (selectedVenues.length > 0) {
        query = query.in('venue_id', selectedVenues);
      }

      // Apply date filter based on date range or predefined filters
      if (dateRange && dateRange.from) {
        const fromDate = dateRange.from.toISOString().split('T')[0]; // Get YYYY-MM-DD
        query = query.gte('start_date', fromDate);

        if (dateRange.to) {
          const toDate = dateRange.to.toISOString().split('T')[0]; // Get YYYY-MM-DD
          query = query.lte('start_date', toDate);
        }
      } else if (selectedDateFilter) {
        // Handle predefined filters
        let filterDate;
        
        switch (selectedDateFilter) {
          case 'today':
            filterDate = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD
            query = query.eq('start_date', filterDate);
            break;
            
          case 'tomorrow':
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            filterDate = tomorrow.toISOString().split('T')[0]; // Tomorrow in YYYY-MM-DD
            query = query.eq('start_date', filterDate);
            break;
            
          case 'this-weekend':
            // Calculate this weekend's dates
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
            const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + (7 - dayOfWeek);
            const friday = new Date(today);
            friday.setDate(today.getDate() + daysUntilFriday);
            
            const sunday = new Date(friday);
            sunday.setDate(friday.getDate() + 2);
            
            query = query
              .gte('start_date', friday.toISOString().split('T')[0])
              .lte('start_date', sunday.toISOString().split('T')[0]);
            break;
            
          case 'next-week':
            // Calculate next week's dates (Monday to Sunday)
            const currentDate = new Date();
            const nextMonday = new Date();
            const currentDay = currentDate.getDay() || 7; // Convert Sunday (0) to 7
            nextMonday.setDate(currentDate.getDate() + (8 - currentDay)); // Next Monday
            
            const nextSunday = new Date(nextMonday);
            nextSunday.setDate(nextMonday.getDate() + 6);
            
            query = query
              .gte('start_date', nextMonday.toISOString().split('T')[0])
              .lte('start_date', nextSunday.toISOString().split('T')[0]);
            break;
            
          default:
            // If none of the above, just filter by today or later
            filterDate = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD
            query = query.gte('start_date', filterDate);
        }
      }

      // Always sort by date and time
      query = query.order('start_date', { ascending: true }).order('start_time', { ascending: true });

      // Execute query
      const { data, error } = await query;

      if (error) {
        console.error('Error applying filters:', error);
        toast.error('Error loading filtered events');
        // Fall back to client-side filtering
        applyClientSideFilters();
      } else if (data) {
        // Process the data and update state
        setFilteredEvents(data as unknown as Event[]);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Error loading filtered events');
      // Fall back to client-side filtering
      applyClientSideFilters();
    } finally {
      setIsLoading(false);
    }
  };

  return { filteredEvents, isLoading };
};
