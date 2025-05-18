
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { safeSpread } from '@/utils/supabaseTypeUtils';

export const useEventRSVP = () => {
  const getAttendeesForEvent = useCallback(async (eventId: string) => {
    try {
      console.log('Fetching attendees for event:', eventId);
      
      // Get "Going" attendees - using manual join approach instead of relying on foreign keys
      const { data: goingData, error: goingError } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          status,
          user_id
        `)
        .eq('event_id', eventId)
        .eq('status', 'Going');

      if (goingError) {
        console.error('Error fetching Going attendees:', goingError);
        throw goingError;
      }

      // Get "Interested" attendees - using manual join approach
      const { data: interestedData, error: interestedError } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          status,
          user_id
        `)
        .eq('event_id', eventId)
        .eq('status', 'Interested');

      if (interestedError) {
        console.error('Error fetching Interested attendees:', interestedError);
        throw interestedError;
      }

      // Extract user IDs and fetch profiles separately
      const goingUserIds = goingData?.map(item => item.user_id).filter(Boolean) || [];
      const interestedUserIds = interestedData?.map(item => item.user_id).filter(Boolean) || [];
      
      // Fetch going profiles
      const { data: goingProfiles, error: goingProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', goingUserIds);
        
      if (goingProfilesError) {
        console.error('Error fetching Going profiles:', goingProfilesError);
      }
      
      // Fetch interested profiles
      const { data: interestedProfiles, error: interestedProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', interestedUserIds);
        
      if (interestedProfilesError) {
        console.error('Error fetching Interested profiles:', interestedProfilesError);
      }

      console.log(`Event ${eventId} attendees:`, {
        going: goingProfiles?.length || 0,
        interested: interestedProfiles?.length || 0
      });

      return {
        going: goingProfiles || [],
        interested: interestedProfiles || [],
      };
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      return { going: [], interested: [] };
    }
  }, []);

  const getFriendAttendeesForEvent = useCallback(async (eventId: string, userId: string) => {
    try {
      if (!eventId || !userId) {
        console.log('Missing eventId or userId for friend attendees fetch');
        return { going: [], interested: [] };
      }

      console.log('[DEBUG] Fetching friend attendees for event:', eventId, 'and user:', userId);
      
      // First get the user's friends
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'Accepted');
      
      if (friendshipsError) {
        console.error('[DEBUG] Error fetching friendships:', friendshipsError);
        return { going: [], interested: [] };
      }
      
      console.log('[DEBUG] Friendships found:', friendships?.length || 0);
      
      // Extract friend IDs
      const friendIds = friendships.map(friendship => 
        friendship.user_id === userId ? friendship.friend_id : friendship.user_id
      ).filter(Boolean);
      
      if (friendIds.length === 0) {
        console.log('[DEBUG] No friends found for user:', userId);
        return { going: [], interested: [] };
      }
      
      console.log('[DEBUG] Friend IDs:', friendIds);
      
      // Get "Going" friends - using separate queries to avoid foreign key dependency
      const { data: goingRsvps, error: goingError } = await supabase
        .from('event_rsvps')
        .select(`
          user_id
        `)
        .eq('event_id', eventId)
        .eq('status', 'Going')
        .in('user_id', friendIds);
      
      if (goingError) {
        console.error('[DEBUG] Error fetching Going friends RSVPs:', goingError);
        return { going: [], interested: [] };
      }
      
      // Get "Interested" friends - using separate queries to avoid foreign key dependency
      const { data: interestedRsvps, error: interestedError } = await supabase
        .from('event_rsvps')
        .select(`
          user_id
        `)
        .eq('event_id', eventId)
        .eq('status', 'Interested')
        .in('user_id', friendIds);
      
      if (interestedError) {
        console.error('[DEBUG] Error fetching Interested friends RSVPs:', interestedError);
        return { going: [], interested: [] };
      }
      
      // Extract user IDs
      const goingFriendIds = goingRsvps?.map(rsvp => rsvp.user_id).filter(Boolean) || [];
      const interestedFriendIds = interestedRsvps?.map(rsvp => rsvp.user_id).filter(Boolean) || [];
      
      console.log('[DEBUG] Friend RSVPs - Going:', goingFriendIds.length, 'Interested:', interestedFriendIds.length);
      
      // Fetch profile data for going friends
      const { data: goingProfiles, error: goingProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', goingFriendIds);
      
      if (goingProfilesError) {
        console.error('[DEBUG] Error fetching Going friends profiles:', goingProfilesError);
      }
      
      // Fetch profile data for interested friends
      const { data: interestedProfiles, error: interestedProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', interestedFriendIds);
      
      if (interestedProfilesError) {
        console.error('[DEBUG] Error fetching Interested friends profiles:', interestedProfilesError);
      }
      
      console.log('[DEBUG] Friends found - Going:', goingProfiles?.length || 0, 'Interested:', interestedProfiles?.length || 0);
      
      return {
        going: goingProfiles || [],
        interested: interestedProfiles || [],
      };
    } catch (error) {
      console.error('[DEBUG] Error fetching friend attendees:', error);
      return { going: [], interested: [] };
    }
  }, []);

  return {
    getAttendeesForEvent,
    getFriendAttendeesForEvent
  };
};
