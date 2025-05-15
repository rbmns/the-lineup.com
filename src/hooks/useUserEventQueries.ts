
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';

export const useUserEventQueries = (
  userId: string | undefined, 
  currentUserId: string | undefined,
  friendshipStatus: 'none' | 'pending' | 'accepted'
) => {
  const { data: userEvents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['user-events', userId, friendshipStatus],
    queryFn: async () => {
      if (!userId) return [];
      
      // Don't fetch events if not friends and not the current user
      if (userId !== currentUserId && friendshipStatus !== 'accepted') {
        console.log('Not fetching events: user is not a friend or the current user');
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('event_rsvps')
          .select(`
            status,
            events (
              id, title, description, event_type,
              start_time, end_time, image_urls, creator, venue_id,
              venues:venue_id (
                id, name, street, city
              ),
              creator:profiles(id, username, avatar_url, email, location, status, tagline),
              event_rsvps(id, user_id, status)
            )
          `)
          .eq('user_id', userId);
          
        if (error) {
          console.error('Error fetching user events:', error);
          return [];
        }
        
        // Process the events data to include RSVP status
        if (!data) return [];
        
        const events = data
          .filter(item => item.events)
          .map(item => {
            const eventData = item.events as any;
            const processedEvent = processEventsData([eventData], currentUserId)[0];
            return {
              ...processedEvent,
              rsvp_status: item.status as 'Going' | 'Interested'
            };
          });
          
        return events;
      } catch (err) {
        console.error('Exception fetching user events:', err);
        return [];
      }
    },
    enabled: !!userId && (userId === currentUserId || friendshipStatus === 'accepted'),
  });

  return {
    userEvents: userEvents || [],
    isLoading,
    error,
    refetch
  };
};
