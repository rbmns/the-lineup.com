
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';

export const useFriendsEvents = (friendIds: string[], currentUserId?: string) => {
  const { data: friendsEvents = [], isLoading, error } = useQuery({
    queryKey: ['friends-events', friendIds, currentUserId],
    queryFn: async () => {
      if (!friendIds.length || !currentUserId) {
        return [];
      }

      try {
        // Get events that friends have RSVPed to
        const { data: friendRsvps, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select(`
            status,
            user_id,
            events (
              id, title, description, event_category,
              start_time, end_time, start_date, end_date,
              image_urls, creator, venue_id, vibe, tags,
              venues:venue_id (
                id, name, street, city
              ),
              creator:profiles(id, username, avatar_url, email, location, status, tagline),
              event_rsvps(id, user_id, status)
            )
          `)
          .in('user_id', friendIds)
          .in('status', ['Going', 'Interested']);

        if (rsvpError) {
          console.error('Error fetching friend RSVPs:', rsvpError);
          return [];
        }

        // Get events created by friends
        const { data: friendCreatedEvents, error: createdError } = await supabase
          .from('events')
          .select(`
            id, title, description, event_category,
            start_time, end_time, start_date, end_date,
            image_urls, creator, venue_id, vibe, tags,
            venues:venue_id (
              id, name, street, city
            ),
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .in('creator', friendIds);

        if (createdError) {
          console.error('Error fetching friend created events:', createdError);
        }

        // Process RSVP events
        const rsvpEvents = friendRsvps
          ?.filter(item => item.events)
          .map(item => {
            const eventData = item.events as any;
            const processedEvents = processEventsData([eventData], currentUserId);
            const processedEvent = processedEvents[0];
            return {
              ...processedEvent,
              friend_rsvp_status: item.status,
              friend_user_id: item.user_id
            };
          }) || [];

        // Process created events
        const createdEvents = friendCreatedEvents
          ? processEventsData(friendCreatedEvents, currentUserId).map(event => ({
              ...event,
              is_friend_creator: true
            }))
          : [];

        // Combine and deduplicate events
        const allEvents = [...rsvpEvents, ...createdEvents];
        const uniqueEvents = allEvents.filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        );

        // Sort by date
        return uniqueEvents.sort((a, b) => {
          const dateA = new Date(a.start_date || '');
          const dateB = new Date(b.start_date || '');
          return dateA.getTime() - dateB.getTime();
        });

      } catch (error) {
        console.error('Error fetching friends events:', error);
        return [];
      }
    },
    enabled: friendIds.length > 0 && !!currentUserId,
  });

  return {
    friendsEvents,
    isLoading,
    error
  };
};
