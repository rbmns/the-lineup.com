
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { filterUpcomingEvents } from '@/utils/date-filtering';

export interface UseEventsResult {
  data: Event[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

export const useEvents = (userId: string | undefined = undefined): UseEventsResult => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', userId],
    queryFn: async () => {
      try {
        console.log('Fetching events for user:', userId);
        
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });
        
        if (error) {
          console.error('Error fetching events:', error);
          throw error;
        }

        if (!data) {
          return [];
        }
        
        // Process the events data
        const processedEvents = processEventsData(data, userId);
        
        // Apply time-based filtering to only show upcoming events
        const filteredEvents = filterUpcomingEvents(processedEvents);
        
        console.log(`Total events fetched: ${processedEvents.length}`);
        console.log(`Filtered events after time filtering: ${filteredEvents.length}`);
        
        return filteredEvents;
      } catch (error) {
        console.error('Error in useEvents:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 10, // Reduced stale time to 10 seconds for more frequent updates
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch
  };
};
