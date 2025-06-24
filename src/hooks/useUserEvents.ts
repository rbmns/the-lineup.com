
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
          .select('event_id, status, created_at')
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

        // Use specific foreign key relationship to avoid ambiguity
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            venues!events_venue_id_fkey(*)
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

        // Now fetch creator profiles separately to avoid foreign key issues
        const creatorIds = eventsData.map(event => event.creator).filter(Boolean);
        
        let creatorsData = [];
        if (creatorIds.length > 0) {
          const { data: creators, error: creatorsError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, email, location, status, tagline')
            .in('id', creatorIds);
            
          if (!creatorsError && creators) {
            creatorsData = creators;
          }
        }
        
        // Combine the data manually
        const eventsWithCreators = eventsData.map(event => ({
          ...event,
          creator: creatorsData.find(creator => creator.id === event.creator) || null
        }));

        // Process the events data
        const allEvents = processEventsData(eventsWithCreators, userId);
        console.log('useUserEvents: Processed events:', allEvents.length, allEvents);
        
        // Add RSVP status to each event from the original RSVP data
        const eventsWithRsvp = allEvents.map(event => {
          const rsvp = rsvpData.find(r => r.event_id === event.id);
          return {
            ...event,
            rsvp_status: rsvp?.status as 'Going' | 'Interested' | null
          };
        });

        console.log('useUserEvents: Events with RSVP status:', eventsWithRsvp);
        
        // Filter and sort events with debugging
        const now = new Date();
        console.log('useUserEvents: Current date for filtering:', now);
        
        const pastEvents = eventsWithRsvp.filter(event => {
          if (!event.start_date) return false;
          const eventDate = new Date(event.start_date);
          const isPast = eventDate < now;
          console.log(`Event ${event.title}: ${event.start_date} is past: ${isPast}`);
          return isPast;
        });
        
        const upcomingEvents = eventsWithRsvp.filter(event => {
          if (!event.start_date) return false;
          const eventDate = new Date(event.start_date);
          const isUpcoming = eventDate >= now;
          console.log(`Event ${event.title}: ${event.start_date} is upcoming: ${isUpcoming}`);
          return isUpcoming;
        });

        const sortedPastEvents = pastEvents.sort((a, b) => new Date(b.start_date!).getTime() - new Date(a.start_date!).getTime());
        const sortedUpcomingEvents = upcomingEvents.sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime());

        console.log('useUserEvents: Final result - Past:', sortedPastEvents.length, 'Upcoming:', sortedUpcomingEvents.length);
        console.log('useUserEvents: Past events:', sortedPastEvents.map(e => ({ id: e.id, title: e.title, date: e.start_date, rsvp: e.rsvp_status })));
        console.log('useUserEvents: Upcoming events:', sortedUpcomingEvents.map(e => ({ id: e.id, title: e.title, date: e.start_date, rsvp: e.rsvp_status })));

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
