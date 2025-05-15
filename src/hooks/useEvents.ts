
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
        // Updated query to include event_types_tags relationship
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
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
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch
  };
};
