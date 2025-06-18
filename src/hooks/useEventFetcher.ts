
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { getEventDateTime } from '@/utils/event-date-utils';
import { toast } from 'sonner';

interface Props {
  onDataFetched?: (events: Event[]) => void;
  onError?: (error: Error) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export const useEventFetcher = ({ onDataFetched, onError, onLoadingChange }: Props = {}) => {
  const fetchEvents = useCallback(async (
    searchQuery: string = '',
    selectedEventTypes: string[] = [],
    selectedVenues: string[] = [],
    dateRange: { from?: Date; to?: Date } | undefined = undefined,
    selectedDateFilter: string = '',
    userId: string | undefined = undefined
  ): Promise<Event[]> => {
    try {
      if (onLoadingChange) onLoadingChange(true);

      // Start building the query
      let query = supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .eq('status', 'published'); // Only show published events

      // Apply text search filter
      if (searchQuery) {
        query = query.textSearch('title', searchQuery, {
          type: 'websearch',
          config: 'english'
        });
      }

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
        console.error('Error fetching events:', error);
        toast.error('Error loading events');
        if (onError) onError(error);
        return [];
      }

      if (!data) {
        console.warn('No events found matching the criteria.');
        return [];
      }

      // Process the data and update state
      const processedEvents = processEventsData(data, userId);
      if (onDataFetched) onDataFetched(processedEvents);
      return processedEvents;

    } catch (error: any) {
      console.error('Unexpected error fetching events:', error);
      toast.error('Unexpected error loading events');
      if (onError) onError(error);
      return [];
    } finally {
      if (onLoadingChange) onLoadingChange(false);
    }
  }, [onDataFetched, onError, onLoadingChange]);

  const fetchSimilarEvents = useCallback(async (
    searchQuery: string,
    selectedEventTypes: string[],
    events: Event[],
    userId: string | undefined = undefined
  ): Promise<Event[]> => {
    try {
      // If there's a search query, perform a text search
      if (searchQuery) {
        // Add a condition to only fetch events that do not match the selected event types
        const { data: queryOnlyResults, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*)
          `)
          .eq('status', 'published') // Only show published events
          .textSearch('title', searchQuery, {
            type: 'websearch',
            config: 'english'
          })
          .not('event_type', 'in', selectedEventTypes) // Exclude selected event types
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (error) {
          console.error("Error fetching query-only events:", error);
          toast.error("Error loading similar events");
          return [];
        }

        if (queryOnlyResults && queryOnlyResults.length > 0) {
          // Mark these events as query-only results
          const markedResults = queryOnlyResults.map(event => ({ ...event, isQueryOnly: true }));
          return processEventsData(markedResults, userId);
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching similar events:", error);
      toast.error("Error loading similar events");
      return [];
    }
  }, []);

  return { fetchEvents, fetchSimilarEvents };
};
