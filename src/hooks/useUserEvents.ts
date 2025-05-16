
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { filterPastEvents, sortEventsByDate } from '@/utils/date-filtering';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { Event } from '@/types';

interface UseUserEventsResult {
  pastEvents: Event[];
  upcomingEvents: Event[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useUserEvents = (userId: string | undefined): UseUserEventsResult => {
  const { data, isLoading, error, refetch: originalRefetch } = useQuery({
    queryKey: ['userEvents', userId],
    queryFn: async () => {
      if (!userId) {
        return { pastEvents: [], upcomingEvents: [] };
      }

      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (eventsError) {
          console.error('Error fetching events:', eventsError);
          throw eventsError;
        }

        if (!eventsData) {
          return { pastEvents: [], upcomingEvents: [] };
        }

        const allEvents = processEventsData(eventsData, userId);
        const pastEvents = filterPastEvents(allEvents);
        const sortedPastEvents = sortEventsByDate(pastEvents);
        const upcomingEvents = allEvents.filter(event => !pastEvents.includes(event));

        return { pastEvents: sortedPastEvents, upcomingEvents };
      } catch (err) {
        console.error('Error in useUserEvents:', err);
        return { pastEvents: [], upcomingEvents: [] };
      }
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Create a wrapper for refetch that returns a void promise
  const refetch = async () => {
    await originalRefetch();
  };

  return {
    pastEvents: data?.pastEvents || [],
    upcomingEvents: data?.upcomingEvents || [],
    isLoading,
    error,
    refetch,
  };
};
