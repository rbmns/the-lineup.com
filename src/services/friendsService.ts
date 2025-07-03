
import { supabase } from '@/integrations/supabase/client';

export interface FriendshipData {
  userId: string;
  friendId: string;
  status: 'accepted' | 'pending' | 'none';
  isFriend: boolean;
}

export const checkFriendshipStatus = async (userId: string, friendId: string): Promise<FriendshipData> => {
  try {
    if (!userId || !friendId || userId === friendId) {
      return {
        userId,
        friendId,
        status: 'none',
        isFriend: false
      };
    }

    // Check for friendship in both directions
    const { data: friendship, error } = await supabase
      .from('friendships')
      .select('status, user_id, friend_id')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .eq('status', 'accepted')
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking friendship:', error);
      throw error;
    }

    const isFriend = !!friendship;
    const status = isFriend ? 'accepted' : 'none';

    return {
      userId,
      friendId,
      status: status as 'accepted' | 'pending' | 'none',
      isFriend
    };
  } catch (error) {
    console.error('Error in checkFriendshipStatus:', error);
    return {
      userId,
      friendId,
      status: 'none',
      isFriend: false
    };
  }
};

export const filterFriendsFromAttendees = async (
  attendees: any[], 
  currentUserId: string | undefined
): Promise<any[]> => {
  if (!currentUserId || !attendees.length) {
    console.log('filterFriendsFromAttendees: No current user or no attendees', { currentUserId, attendeesLength: attendees.length });
    return [];
  }

  try {
    console.log('filterFriendsFromAttendees: Processing attendees:', attendees);
    
    // Get all user IDs from attendees
    const userIds = attendees.map(attendee => attendee.id).filter(Boolean);
    
    console.log('filterFriendsFromAttendees: Extracted user IDs:', userIds);
    
    if (!userIds.length) {
      console.log('filterFriendsFromAttendees: No valid user IDs found');
      return [];
    }

    // Get all friendships for the current user
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('user_id, friend_id')
      .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`)
      .eq('status', 'Accepted');

    console.log('filterFriendsFromAttendees: Friendships query result:', { friendships, error });

    if (error) {
      console.error('Error fetching friendships:', error);
      return [];
    }

    if (!friendships || friendships.length === 0) {
      console.log('filterFriendsFromAttendees: No friendships found');
      return [];
    }

    // Extract friend IDs
    const friendIds = new Set(
      friendships.map(friendship => 
        friendship.user_id === currentUserId ? friendship.friend_id : friendship.user_id
      )
    );

    console.log('filterFriendsFromAttendees: Friend IDs:', Array.from(friendIds));

    // Filter attendees to only include friends
    const friendAttendees = attendees.filter(attendee => 
      attendee.id && friendIds.has(attendee.id)
    );

    console.log(`filterFriendsFromAttendees: Filtered ${attendees.length} attendees to ${friendAttendees.length} friends:`, friendAttendees);
    return friendAttendees;
  } catch (error) {
    console.error('Error filtering friend attendees:', error);
    return [];
  }
};
