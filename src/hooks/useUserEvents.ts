
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { filterPastEvents, sortEventsByDate } from '@/utils/date-filtering';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { filterEventsByTime } from '@/utils/eventTimeFiltering';
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
        
        // Apply time-based filtering to get currently visible events
        const visibleEvents = filterEventsByTime(allEvents);
        
        // Separate past and upcoming events from the visible events
        const pastEvents = filterPastEvents(allEvents); // Keep past events for history
        const sortedPastEvents = sortEventsByDate(pastEvents);
        
        // Upcoming events are those that are visible and not in the past
        const upcomingEvents = visibleEvents.filter(event => !pastEvents.includes(event));

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
