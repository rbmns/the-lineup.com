
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { checkRealTimeFriendshipStatus } from '@/utils/friendshipUtils';

/**
 * Hook to manage friendship status and actions for a profile
 */
export const useProfileFriendship = (
  userId: string | undefined,
  profileId: string | null,
  isOwnProfile: boolean
) => {
  const [isFriend, setIsFriend] = useState<boolean | null>(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequestReceived, setFriendRequestReceived] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'accepted'>('none');

  useEffect(() => {
    if (profileId) {
      if (userId && !isOwnProfile) {
        checkFriendshipStatus(userId, profileId);
        checkIfBlocked(userId, profileId);
      }
    }
  }, [profileId, userId, isOwnProfile]);

  useEffect(() => {
    const updateFriendshipStatus = async () => {
      if (userId && profileId && !isOwnProfile) {
        const status = await checkRealTimeFriendshipStatus(userId, profileId);
        setFriendshipStatus(status);
      }
    };
    
    updateFriendshipStatus();
  }, [userId, profileId, isOwnProfile]);

  const checkFriendshipStatus = async (userId: string, profileId: string) => {
    try {
      // Check if a friend request has been sent by the current user
      const { data: sentRequest, error: sentError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_id', userId)
        .eq('receiver_id', profileId)
        .single();
      
      if (sentError && sentError.code !== 'PGRST116') {
        console.error('Error checking sent friend request:', sentError);
      } else if (sentRequest) {
        setFriendRequestSent(true);
      }
      
      // Check if a friend request has been received by the current user
      const { data: receivedRequest, error: receivedError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_id', profileId)
        .eq('receiver_id', userId)
        .single();
      
      if (receivedError && receivedError.code !== 'PGRST116') {
        console.error('Error checking received friend request:', receivedError);
      } else if (receivedRequest) {
        setFriendRequestReceived(true);
      }
      
      // Check if the users are already friends
      const { data: friendship, error: friendshipError } = await supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${userId}, friend_id.eq.${userId}`)
        .or(`user_id.eq.${profileId}, friend_id.eq.${profileId}`);
      
      if (friendshipError) {
        console.error('Error checking friendship:', friendshipError);
      } else {
        const areFriends = friendship && friendship.some(record =>
          (record.user_id === userId && record.friend_id === profileId) ||
          (record.user_id === profileId && record.friend_id === userId)
        );
        setIsFriend(areFriends);
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };

  const checkIfBlocked = async (userId: string, profileId: string) => {
    try {
      const { data: block, error: blockError } = await supabase
        .from('blocks')
        .select('*')
        .eq('blocker_id', userId)
        .eq('blocked_id', profileId)
        .single();
      
      if (blockError && blockError.code !== 'PGRST116') {
        console.error('Error checking block status:', blockError);
      } else if (block) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    } catch (error) {
      console.error('Error checking block status:', error);
    }
  };

  return {
    isFriend,
    friendRequestSent,
    friendRequestReceived,
    isBlocked,
    friendshipStatus,
    setIsFriend,
    setFriendRequestSent,
    setFriendRequestReceived,
    setIsBlocked,
    setFriendshipStatus
  };
};
