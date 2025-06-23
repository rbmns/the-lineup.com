
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { filterPastEvents, sortEventsByDate, filterUpcomingEvents } from '@/utils/date-filtering';
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
        console.log('useUserEvents: No userId provided');
        return { pastEvents: [], upcomingEvents: [] };
      }

      try {
        console.log('useUserEvents: Fetching user events for userId:', userId);
        
        // First get the user's RSVPs with "Going" or "Interested" status
        const { data: rsvpData, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select('event_id, status')
          .eq('user_id', userId)
          .in('status', ['Going', 'Interested']);

        if (rsvpError) {
          console.error('useUserEvents: Error fetching user RSVPs:', rsvpError);
          throw rsvpError;
        }

        console.log('useUserEvents: Found RSVPs:', rsvpData?.length || 0, rsvpData);

        if (!rsvpData || rsvpData.length === 0) {
          console.log('useUserEvents: No RSVPs found for user');
          return { pastEvents: [], upcomingEvents: [] };
        }

        // Get the event IDs the user has RSVPed to
        const eventIds = rsvpData.map(rsvp => rsvp.event_id);
        console.log('useUserEvents: Event IDs to fetch:', eventIds);

        // Fetch the events the user has RSVPed to (only published events)
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles!events_creator_fkey(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .eq('status', 'published')
          .in('id', eventIds)
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (eventsError) {
          console.error('useUserEvents: Error fetching events:', eventsError);
          throw eventsError;
        }

        console.log('useUserEvents: Fetched events raw data:', eventsData?.length || 0, eventsData);

        if (!eventsData || eventsData.length === 0) {
          console.log('useUserEvents: No events found for the RSVPed event IDs');
          return { pastEvents: [], upcomingEvents: [] };
        }

        // Process the events data
        const allEvents = processEventsData(eventsData, userId);
        console.log('useUserEvents: Processed events:', allEvents.length, allEvents);
        
        // Filter and sort events
        const pastEvents = filterPastEvents(allEvents);
        const sortedPastEvents = sortEventsByDate(pastEvents);
        
        const upcomingEvents = filterUpcomingEvents(allEvents);
        const sortedUpcomingEvents = sortEventsByDate(upcomingEvents);

        console.log('useUserEvents: Final result - Past:', sortedPastEvents.length, 'Upcoming:', sortedUpcomingEvents.length);

        return { pastEvents: sortedPastEvents, upcomingEvents: sortedUpcomingEvents };
      } catch (err) {
        console.error('useUserEvents: Error in useUserEvents:', err);
        throw err;
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
