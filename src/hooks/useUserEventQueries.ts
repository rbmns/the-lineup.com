
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
        // Fetch events where user has RSVPed (either Going or Interested)
        const { data, error } = await supabase
          .from('event_rsvps')
          .select(`
            status,
            created_at,
            events (
              id, title, description, event_category,
              start_date, start_time, end_date, end_time, 
              image_urls, creator, venue_id, location, vibe, tags,
              created_at, updated_at,
              venues:venue_id (
                id, name, street, city
              ),
              creator:profiles!events_creator_fkey(id, username, avatar_url, email, location, status, tagline)
            )
          `)
          .eq('user_id', userId)
          .in('status', ['Going', 'Interested'])
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching user events:', error);
          return [];
        }
        
        if (!data) return [];
        
        // Process the events data to include RSVP status and attendee counts
        const events = data
          .filter(item => item.events)
          .map(item => {
            const eventData = item.events as any;
            const processedEvent = processEventsData([eventData], currentUserId)[0];
            
            // Add the user's RSVP status
            return {
              ...processedEvent,
              rsvp_status: item.status as 'Going' | 'Interested',
              // Mock attendee counts for now - you can enhance this with real data later
              attendees: {
                going: Math.floor(Math.random() * 20) + 5,
                interested: Math.floor(Math.random() * 10) + 2
              }
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
