
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
      console.log('Fetching suggested friends for user:', userId);
      
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
      
      console.log('Current friend IDs:', friendIds);

      // Get events where the current user had "Going" status (including past events)
      const { data: userRSVPs, error: userRSVPsError } = await supabase
        .from('event_rsvps')
        .select(`
          event_id,
          events!inner(id, title, start_date)
        `)
        .eq('user_id', userId)
        .eq('status', 'Going');

      if (userRSVPsError) {
        console.error('Error fetching user RSVPs:', userRSVPsError);
        throw userRSVPsError;
      }

      console.log('User RSVPs found:', userRSVPs?.length || 0);

      if (!userRSVPs || userRSVPs.length === 0) {
        console.log('No events found for user');
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      const eventIds = userRSVPs.map(rsvp => rsvp.event_id);
      console.log('Event IDs to check:', eventIds);

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

      console.log('Co-attendees found:', coAttendees?.length || 0);

      if (!coAttendees || coAttendees.length === 0) {
        console.log('No co-attendees found');
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      // Filter out existing friends and process suggestions
      const suggestions: SuggestedFriend[] = [];
      const seenUsers = new Set<string>();

      // Sort by most recent event first
      const sortedCoAttendees = coAttendees.sort((a, b) => {
        const eventA = Array.isArray(a.events) ? a.events[0] : a.events;
        const eventB = Array.isArray(b.events) ? b.events[0] : b.events;
        const dateA = new Date(eventA?.start_date || '');
        const dateB = new Date(eventB?.start_date || '');
        return dateB.getTime() - dateA.getTime();
      });

      console.log('Processing co-attendees...');

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

        // Handle array or single object from Supabase joins
        const profile = Array.isArray(attendee.profiles) ? attendee.profiles[0] : attendee.profiles;
        const event = Array.isArray(attendee.events) ? attendee.events[0] : attendee.events;

        if (profile && event) {
          suggestions.push({
            id: profile.id,
            username: profile.username,
            avatar_url: profile.avatar_url,
            email: profile.email,
            location: profile.location,
            location_category: profile.location_category,
            status: profile.status,
            status_details: profile.status_details,
            tagline: profile.tagline,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            sharedEventId: event.id,
            sharedEventTitle: event.title,
            sharedEventDate: event.start_date,
            connectionReason: `You both attended "${event.title}"`
          });
        }
      });

      console.log('Final suggestions:', suggestions.length);
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
