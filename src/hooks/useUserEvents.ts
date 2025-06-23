
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
        return { pastEvents: [], upcomingEvents: [] };
      }

      try {
        console.log('Fetching user events for userId:', userId);
        
        // First get the user's RSVPs with "Going" or "Interested" status
        const { data: rsvpData, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select('event_id, status')
          .eq('user_id', userId)
          .in('status', ['Going', 'Interested']); // Only get Going and Interested RSVPs

        if (rsvpError) {
          console.error('Error fetching user RSVPs:', rsvpError);
          throw rsvpError;
        }

        console.log('Found RSVPs:', rsvpData?.length || 0, rsvpData);

        if (!rsvpData || rsvpData.length === 0) {
          console.log('No RSVPs found for user');
          return { pastEvents: [], upcomingEvents: [] };
        }

        // Get the event IDs the user has RSVPed to
        const eventIds = rsvpData.map(rsvp => rsvp.event_id);
        console.log('Event IDs to fetch:', eventIds);

        // Fetch the events the user has RSVPed to (only published events)
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .eq('status', 'published') // Only show published events
          .in('id', eventIds)
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (eventsError) {
          console.error('Error fetching events:', eventsError);
          throw eventsError;
        }

        console.log('Fetched events:', eventsData?.length || 0);

        if (!eventsData) {
          return { pastEvents: [], upcomingEvents: [] };
        }

        const allEvents = processEventsData(eventsData, userId);
        console.log('Processed events:', allEvents.length);
        
        const pastEvents = filterPastEvents(allEvents);
        const sortedPastEvents = sortEventsByDate(pastEvents);
        
        const upcomingEvents = filterUpcomingEvents(allEvents);
        const sortedUpcomingEvents = sortEventsByDate(upcomingEvents);

        console.log('Final result - Past:', sortedPastEvents.length, 'Upcoming:', sortedUpcomingEvents.length);

        return { pastEvents: sortedPastEvents, upcomingEvents: sortedUpcomingEvents };
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
