
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

interface EventBasedSuggestion extends UserProfile {
  mutual_events: Array<{
    id: string;
    title: string;
    start_date?: string;
    event_category: string;
  }>;
  mutual_event_count: number;
}

export const useEventBasedSuggestions = (currentUserId?: string, friendIds: string[] = []) => {
  const { data: suggestions = [], isLoading, error } = useQuery({
    queryKey: ['event-based-suggestions', currentUserId, friendIds],
    queryFn: async () => {
      if (!currentUserId) return [];

      try {
        // Get events the current user has RSVPed to (Going or Interested)
        const { data: userEvents, error: userEventsError } = await supabase
          .from('event_rsvps')
          .select(`
            event_id,
            events!inner (
              id, title, start_date, event_category
            )
          `)
          .eq('user_id', currentUserId)
          .in('status', ['Going', 'Interested']);

        if (userEventsError) {
          console.error('Error fetching user events:', userEventsError);
          return [];
        }

        if (!userEvents || userEvents.length === 0) return [];

        const userEventIds = userEvents.map(item => item.event_id);

        // Find other users who RSVPed to the same events
        const { data: mutualRsvps, error: mutualError } = await supabase
          .from('event_rsvps')
          .select(`
            user_id,
            event_id,
            events!inner (
              id, title, start_date, event_category
            ),
            profiles!inner (
              id, username, avatar_url, email, location, status, tagline
            )
          `)
          .in('event_id', userEventIds)
          .in('status', ['Going', 'Interested'])
          .neq('user_id', currentUserId);

        if (mutualError) {
          console.error('Error fetching mutual RSVPs:', mutualError);
          return [];
        }

        if (!mutualRsvps) return [];

        // Group by user and collect mutual events
        const userEventMap = new Map<string, {
          profile: UserProfile;
          events: Array<{ id: string; title: string; start_date?: string; event_category: string; }>;
        }>();

        mutualRsvps.forEach(rsvp => {
          const userId = rsvp.user_id;
          const profile = rsvp.profiles as UserProfile;
          const event = rsvp.events as any;

          // Skip if user is already a friend or has pending request
          if (friendIds.includes(userId)) return;

          if (!userEventMap.has(userId)) {
            userEventMap.set(userId, {
              profile,
              events: []
            });
          }

          const userData = userEventMap.get(userId)!;
          // Avoid duplicate events
          if (!userData.events.find(e => e.id === event.id)) {
            userData.events.push({
              id: event.id,
              title: event.title,
              start_date: event.start_date,
              event_category: event.event_category
            });
          }
        });

        // Convert to suggestion format and sort by mutual event count
        const suggestions: EventBasedSuggestion[] = Array.from(userEventMap.entries())
          .map(([userId, userData]) => ({
            ...userData.profile,
            mutual_events: userData.events.sort((a, b) => {
              // Sort by date, most recent first
              const dateA = new Date(a.start_date || '');
              const dateB = new Date(b.start_date || '');
              return dateB.getTime() - dateA.getTime();
            }),
            mutual_event_count: userData.events.length
          }))
          .filter(suggestion => suggestion.mutual_event_count > 0)
          .sort((a, b) => b.mutual_event_count - a.mutual_event_count)
          .slice(0, 6); // Limit to 6 suggestions

        return suggestions;

      } catch (error) {
        console.error('Error fetching event-based suggestions:', error);
        return [];
      }
    },
    enabled: !!currentUserId,
  });

  return {
    suggestions,
    isLoading,
    error
  };
};
