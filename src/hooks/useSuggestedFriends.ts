
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
      console.log('No userId provided to useSuggestedFriends');
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      console.log('=== DEBUGGING SUGGESTED FRIENDS ===');
      console.log('Fetching suggested friends for user:', userId);
      
      // First, get current friends to exclude them
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('user_id, friend_id, status')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'Accepted');

      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
      }

      const friendIds = friendships?.map(friendship => 
        friendship.user_id === userId ? friendship.friend_id : friendship.user_id
      ) || [];
      
      console.log('Current friend IDs:', friendIds);

      // Get ALL RSVPs for this user (both Going and Interested)
      const { data: userRSVPs, error: userRSVPsError } = await supabase
        .from('event_rsvps')
        .select('event_id, status')
        .eq('user_id', userId);

      if (userRSVPsError) {
        console.error('Error fetching user RSVPs:', userRSVPsError);
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      console.log('All user RSVPs found:', userRSVPs?.length || 0);
      console.log('User RSVPs:', userRSVPs);

      if (!userRSVPs || userRSVPs.length === 0) {
        console.log('No RSVPs found for user');
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      // Filter to only "Going" RSVPs
      const goingRSVPs = userRSVPs.filter(rsvp => rsvp.status === 'Going');
      console.log('Going RSVPs:', goingRSVPs);
      
      if (goingRSVPs.length === 0) {
        console.log('No "Going" RSVPs found for user');
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      const eventIds = goingRSVPs.map(rsvp => rsvp.event_id);
      console.log('Event IDs where user is going:', eventIds);

      // Get other users who also had "Going" status for the same events
      const { data: coAttendees, error: coAttendeesError } = await supabase
        .from('event_rsvps')
        .select('user_id, event_id, status')
        .in('event_id', eventIds)
        .eq('status', 'Going')
        .neq('user_id', userId);

      if (coAttendeesError) {
        console.error('Error fetching co-attendees:', coAttendeesError);
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      console.log('Co-attendees found:', coAttendees?.length || 0);
      console.log('Co-attendees data:', coAttendees);

      if (!coAttendees || coAttendees.length === 0) {
        console.log('No co-attendees found');
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs and filter out existing friends and dismissed suggestions
      const uniqueUserIds = [...new Set(coAttendees.map(attendee => attendee.user_id))];
      console.log('Unique co-attendee user IDs:', uniqueUserIds);
      
      const filteredUserIds = uniqueUserIds.filter(id => 
        !friendIds.includes(id) && !dismissedSuggestions.includes(id)
      );

      console.log('Filtered user IDs (excluding friends/dismissed):', filteredUserIds);

      if (filteredUserIds.length === 0) {
        console.log('No new suggested friends after filtering');
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      // Get profile data for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', filteredUserIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      console.log('Profiles found:', profiles?.length || 0);
      console.log('Profile data:', profiles);

      // Get event data for the shared events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, title, start_date')
        .in('id', eventIds);

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        setSuggestedFriends([]);
        setLoading(false);
        return;
      }

      console.log('Events found:', events?.length || 0);
      console.log('Event data:', events);

      // Create suggestions by matching users with their shared events
      const suggestions: SuggestedFriend[] = [];
      const seenUsers = new Set<string>();

      filteredUserIds.forEach(attendeeUserId => {
        if (seenUsers.has(attendeeUserId)) return;
        seenUsers.add(attendeeUserId);

        const profile = profiles?.find(p => p.id === attendeeUserId);
        if (!profile) {
          console.log(`No profile found for user ${attendeeUserId}`);
          return;
        }

        // Find a shared event for this user
        const sharedAttendance = coAttendees.find(attendee => attendee.user_id === attendeeUserId);
        if (!sharedAttendance) {
          console.log(`No shared attendance found for user ${attendeeUserId}`);
          return;
        }

        const sharedEvent = events?.find(event => event.id === sharedAttendance.event_id);
        if (!sharedEvent) {
          console.log(`No shared event found for event ID ${sharedAttendance.event_id}`);
          return;
        }

        console.log(`Creating suggestion for user ${profile.username} based on event ${sharedEvent.title}`);

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
          onboarded: profile.onboarded,
          onboarding_data: profile.onboarding_data,
          role: profile.role,
          sharedEventId: sharedEvent.id,
          sharedEventTitle: sharedEvent.title,
          sharedEventDate: sharedEvent.start_date,
          connectionReason: `You both attended "${sharedEvent.title}"`
        });
      });

      // Sort by most recent shared event
      suggestions.sort((a, b) => {
        const dateA = new Date(a.sharedEventDate || '');
        const dateB = new Date(b.sharedEventDate || '');
        return dateB.getTime() - dateA.getTime();
      });

      console.log('Final suggestions created:', suggestions.length);
      console.log('Suggestions:', suggestions);
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
