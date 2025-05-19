
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { filterEventsByDate } from '@/utils/date-filtering';

interface UseSimilarEventsHandlerProps {
  mainEvents: Event[];
  hasActiveFilters: boolean;
  selectedEventTypes: string[];
  dateRange: any;
  selectedDateFilter: string;
  userId?: string;
}

export const useSimilarEventsHandler = ({
  mainEvents,
  hasActiveFilters,
  selectedEventTypes,
  dateRange,
  selectedDateFilter,
  userId
}: UseSimilarEventsHandlerProps) => {
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only fetch similar events if we have active filters but no main events
    if (!hasActiveFilters || mainEvents.length > 0) {
      setSimilarEvents([]);
      return;
    }

    const fetchSimilarEvents = async () => {
      setIsLoading(true);
      try {
        // Get current date for filtering
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Start with a base query - excluding exact matches for selected types
        let query = supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .gte('start_date', currentDate) // Only future events
          .order('start_date', { ascending: true })
          .limit(6);

        // If we have event types selected, find other event types
        if (selectedEventTypes.length > 0) {
          // Don't exclude the selected types - they might be similar enough
          // Just not exact matches for all filters combined
        }
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching similar events:', error);
          setSimilarEvents([]);
          return;
        }

        if (!data || data.length === 0) {
          setSimilarEvents([]);
          return;
        }
        
        // Process the events
        const processedEvents = processEventsData(data, userId);
        
        // Apply date filtering if needed
        let filteredEvents = processedEvents;
        if (dateRange || selectedDateFilter) {
          // Use approximately the same date range logic
          filteredEvents = filterEventsByDate(processedEvents, selectedDateFilter, dateRange);
        }

        setSimilarEvents(filteredEvents.slice(0, 4)); // Limit to 4 similar events
      } catch (error) {
        console.error('Error in similar events hook:', error);
        setSimilarEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarEvents();
  }, [mainEvents.length, hasActiveFilters, selectedEventTypes, dateRange, selectedDateFilter, userId]);

  return { similarEvents, isLoading };
};
