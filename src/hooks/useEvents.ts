
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
        
        // Updated query to use event_category instead of event_type
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
        
        return processEventsData(data, userId);
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
