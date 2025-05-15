
import { supabase } from '@/lib/supabase';

/**
 * Check friendship status in real-time with database query
 * @param currentUserId - The ID of the current user
 * @param profileId - The ID of the profile being viewed
 * @returns Promise resolving to 'none', 'pending', or 'accepted'
 */
export const checkRealTimeFriendshipStatus = async (
  currentUserId: string | undefined, 
  profileId: string | undefined
): Promise<'none' | 'pending' | 'accepted'> => {
  if (!currentUserId || !profileId || currentUserId === profileId) {
    return 'none';
  }
  
  try {
    console.log(`Checking real-time friendship status between ${currentUserId} and ${profileId}`);
    
    // Query to find any friendship between the users
    const { data, error } = await supabase
      .from('friendships')
      .select('status, user_id, friend_id')
      .or(`and(user_id.eq.${currentUserId},friend_id.eq.${profileId}),and(user_id.eq.${profileId},friend_id.eq.${currentUserId})`)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking friendship status:', error);
      return 'none';
    }
    
    if (!data) {
      console.log(`No friendship found between ${currentUserId} and ${profileId}`);
      return 'none';
    }
    
    console.log(`Friendship found between ${currentUserId} and ${profileId} with status: ${data.status}`);
    
    if (data.status === 'Accepted') {
      return 'accepted';
    } else if (data.status === 'Pending') {
      return 'pending';
    }
    
    return 'none';
  } catch (error) {
    console.error('Error in checkRealTimeFriendshipStatus:', error);
    return 'none';
  }
};

/**
 * Determine if a profile should be clickable based on friendship status
 * @param friendshipStatus - The friendship status between users
 * @param isCurrentUser - Whether this is the current user's profile
 * @returns boolean indicating if profile should be clickable
 */
export const isProfileClickable = (
  friendshipStatus: 'none' | 'pending' | 'accepted',
  isCurrentUser: boolean
): boolean => {
  // User can always view their own profile
  if (isCurrentUser) return true;
  
  // Only allow clicking on accepted friend profiles
  return friendshipStatus === 'accepted';
};
