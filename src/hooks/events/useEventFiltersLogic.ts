
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { filterEventsByType, filterEventsByVenue } from '@/utils/eventUtils';
import { filterEventsByDateRange } from '@/utils/date-filtering';
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
      result = result.filter(event => filterEventsByDateRange(event, selectedDateFilter, dateRange));
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
        const fromDate = dateRange.from.toISOString(); // Use full datetime
        query = query.gte('start_datetime', fromDate);

        if (dateRange.to) {
          const toDate = dateRange.to.toISOString(); // Use full datetime
          query = query.lte('start_datetime', toDate);
        }
      } else if (selectedDateFilter) {
        // Handle predefined filters
        let filterDate;
        
        switch (selectedDateFilter) {
          case 'today':
            filterDate = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD
            query = query.eq('start_datetime', filterDate);
            break;
            
          case 'tomorrow':
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            filterDate = tomorrow.toISOString().split('T')[0]; // Tomorrow in YYYY-MM-DD
            query = query.eq('start_datetime', filterDate);
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
              .gte('start_datetime', friday.toISOString())
              .lte('start_datetime', sunday.toISOString());
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
              .gte('start_datetime', nextMonday.toISOString())
              .lte('start_datetime', nextSunday.toISOString());
            break;
            
          default:
            // If none of the above, just filter by today or later
            const now = new Date();
            query = query.gte('start_datetime', now.toISOString());
        }
      }

      // Always sort by datetime
      query = query.order('start_datetime', { ascending: true });

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
