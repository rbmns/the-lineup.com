
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProfileStatusManagerProps {
  userId: string | undefined;
  profileId: string | null;
  isOwnProfile: boolean;
  onUpdateFriendship: (isFriend: boolean | null, sentRequest: boolean, receivedRequest: boolean) => void;
  onUpdateBlockStatus: (blocked: boolean) => void;
}

export const ProfileStatusManager: React.FC<ProfileStatusManagerProps> = ({
  userId,
  profileId,
  isOwnProfile,
  onUpdateFriendship,
  onUpdateBlockStatus
}) => {
  const [isFriend, setIsFriend] = useState<boolean | null>(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequestReceived, setFriendRequestReceived] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (userId && profileId && !isOwnProfile) {
      checkFriendshipStatus(userId, profileId);
      checkIfBlocked(userId, profileId);
    }
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
      
      onUpdateFriendship(isFriend, friendRequestSent, friendRequestReceived);
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
        onUpdateBlockStatus(true);
      } else {
        setIsBlocked(false);
        onUpdateBlockStatus(false);
      }
    } catch (error) {
      console.error('Error checking block status:', error);
    }
  };

  return null; // This is a non-visual component that just manages state
};
