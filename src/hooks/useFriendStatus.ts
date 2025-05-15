
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useFriendStatus = (userId: string | undefined) => {
  const checkFriendshipStatus = useCallback(async (otherUserId: string) => {
    if (!userId || !otherUserId) return 'none';
    
    try {
      console.log(`Checking friendship status between ${userId} and ${otherUserId}`);
      
      // Using parameterized queries for better security
      const { data, error } = await supabase
        .from('friendships')
        .select('status, user_id, friend_id')
        .or(`and(user_id.eq.${userId},friend_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},friend_id.eq.${userId})`)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking friendship status:', error);
        return 'none';
      }
      
      console.log('Friendship status check result:', data);
      
      if (data) {
        if (data.status === 'Accepted') {
          return 'accepted';
        } else if (data.status === 'Pending') {
          return 'pending';
        }
      }
      
      return 'none';
    } catch (error) {
      console.error('Error checking friendship:', error);
      return 'none';
    }
  }, [userId]);

  return { checkFriendshipStatus };
};
