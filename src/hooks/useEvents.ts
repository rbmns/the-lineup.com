import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';

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
        // Get the current date as YYYY-MM-DD for filtering
        const currentDate = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .gte('start_date', currentDate) // Filter events from today onwards
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });
        
        if (error) {
          console.error('Error fetching events:', error);
          throw error;
        }

        if (!data) {
          return [];
        }
        
        // Process the events and filter out those that are more than 30 minutes past their start time
        const processedEvents = processEventsData(data, userId);
        
        const now = new Date();
        const filteredEvents = processedEvents.filter(event => {
          // If no start_date or start_time, keep the event
          if (!event.start_date || !event.start_time) return true;
          
          // Create the event start datetime
          const eventStartDateTime = new Date(`${event.start_date}T${event.start_time}`);
          
          // Add 30 minutes to the start time
          const cutoffTime = new Date(eventStartDateTime.getTime() + 30 * 60 * 1000);
          
          // Keep the event if current time is before the cutoff time
          return now < cutoffTime;
        });
        
        console.log(`Filtered ${processedEvents.length - filteredEvents.length} events that are past their 30-minute cutoff`);
        
        return filteredEvents;
      } catch (error) {
        console.error('Error in useEvents:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // Reduced stale time to 30 seconds for more frequent updates
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch
  };
};
