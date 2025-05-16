
import { supabase } from '@/lib/supabase';

/**
 * Checks the current friendship status between two users in real-time
 */
export const checkRealTimeFriendshipStatus = async (
  userId: string, 
  profileId: string
): Promise<'none' | 'pending' | 'accepted'> => {
  try {
    // Check if a friend request has been sent by the current user
    const { data: sentRequest, error: sentError } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('sender_id', userId)
      .eq('receiver_id', profileId)
      .single();
    
    if (sentRequest) {
      return 'pending'; // Request sent, waiting for acceptance
    }
    
    // Check if a friend request has been received by the current user
    const { data: receivedRequest, error: receivedError } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('sender_id', profileId)
      .eq('receiver_id', userId)
      .single();
    
    if (receivedRequest) {
      return 'pending'; // Request received, waiting for action
    }
    
    // Check if the users are already friends
    const { data: friendship, error: friendshipError } = await supabase
      .from('friends')
      .select('*')
      .or(`user_id.eq.${userId}, friend_id.eq.${userId}`)
      .or(`user_id.eq.${profileId}, friend_id.eq.${profileId}`);
    
    if (friendshipError) {
      console.error('Error checking friendship:', friendshipError);
      return 'none';
    }
    
    const areFriends = friendship && friendship.some(record =>
      (record.user_id === userId && record.friend_id === profileId) ||
      (record.user_id === profileId && record.friend_id === userId)
    );
    
    return areFriends ? 'accepted' : 'none';
  } catch (error) {
    console.error('Error checking real-time friendship status:', error);
    return 'none';
  }
};

/**
 * Determines if a profile should be clickable based on friendship status and whether it's the current user's profile
 * @param friendshipStatus The current friendship status: 'none', 'pending', or 'accepted'
 * @param isCurrentUser Whether this is the current user's own profile
 * @returns Boolean indicating if the profile should be clickable
 */
export const isProfileClickable = (
  friendshipStatus: 'none' | 'pending' | 'accepted' | undefined, 
  isCurrentUser: boolean
): boolean => {
  // Always allow clicking on your own profile
  if (isCurrentUser) {
    return true;
  }
  
  // Allow clicking on friends' profiles
  if (friendshipStatus === 'accepted') {
    return true;
  }
  
  // In all other cases (no friendship or pending request), prevent profile navigation
  return false;
};
