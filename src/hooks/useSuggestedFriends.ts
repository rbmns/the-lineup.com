
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

interface SuggestedFriend extends UserProfile {
  sharedEventId: string;
  sharedEventTitle: string;
  sharedEventDate: string;
  connectionReason: string;
}

export const useSuggestedFriends = (userId: string | undefined) => {
  const [suggestedFriends, setSuggestedFriends] = useState<SuggestedFriend[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const fetchSuggestedFriends = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // First, get current friends to exclude them
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('user_id, friend_id')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'Accepted');

      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
        throw friendshipsError;
      }

      const friendIds = friendships?.map(friendship => 
        friendship.user_id === userId ? friendship.friend_id : friendship.user_id
      ) || [];

      // Get events where the current user had "Going" status
      const { data: userEvents, error: userEventsError } = await supabase
        .from('event_rsvps')
        .select(`
          event_id,
          events!inner(id, title, start_date, end_date)
        `)
        .eq('user_id', userId)
        .eq('status', 'Going');

      if (userEventsError) {
        console.error('Error fetching user events:', userEventsError);
        throw userEventsError;
      }

      if (!userEvents || userEvents.length === 0) {
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      const eventIds = userEvents.map(ue => ue.event_id);

      // Get other users who also had "Going" status for the same events
      const { data: coAttendees, error: coAttendeesError } = await supabase
        .from('event_rsvps')
        .select(`
          user_id,
          event_id,
          events!inner(id, title, start_date),
          profiles!inner(*)
        `)
        .in('event_id', eventIds)
        .eq('status', 'Going')
        .neq('user_id', userId);

      if (coAttendeesError) {
        console.error('Error fetching co-attendees:', coAttendeesError);
        throw coAttendeesError;
      }

      if (!coAttendees) {
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      // Filter out existing friends and process suggestions
      const suggestions: SuggestedFriend[] = [];
      const seenUsers = new Set<string>();

      // Sort by most recent event first
      const sortedCoAttendees = coAttendees.sort((a, b) => {
        const dateA = new Date(a.events.start_date || '');
        const dateB = new Date(b.events.start_date || '');
        return dateB.getTime() - dateA.getTime();
      });

      sortedCoAttendees.forEach(attendee => {
        const attendeeUserId = attendee.user_id;
        
        // Skip if already friends, already seen, or dismissed
        if (
          friendIds.includes(attendeeUserId) || 
          seenUsers.has(attendeeUserId) ||
          dismissedSuggestions.includes(attendeeUserId)
        ) {
          return;
        }

        seenUsers.add(attendeeUserId);

        const profile = attendee.profiles as any;
        const event = attendee.events as any;

        suggestions.push({
          ...profile,
          sharedEventId: event.id,
          sharedEventTitle: event.title,
          sharedEventDate: event.start_date,
          connectionReason: `You both attended "${event.title}"`
        });
      });

      setSuggestedFriends(suggestions.slice(0, 10)); // Limit to 10 suggestions
    } catch (error) {
      console.error('Error fetching suggested friends:', error);
      setSuggestedFriends([]);
    } finally {
      setLoading(false);
    }
  }, [userId, dismissedSuggestions]);

  const dismissSuggestion = useCallback((userIdToDismiss: string) => {
    setDismissedSuggestions(prev => [...prev, userIdToDismiss]);
    setSuggestedFriends(prev => prev.filter(friend => friend.id !== userIdToDismiss));
  }, []);

  useEffect(() => {
    fetchSuggestedFriends();
  }, [fetchSuggestedFriends]);

  return {
    suggestedFriends,
    loading,
    dismissSuggestion,
    refreshSuggestions: fetchSuggestedFriends
  };
};
