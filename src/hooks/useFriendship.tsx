
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useFriendship = (currentUserId?: string, otherUserId?: string) => {
  const [status, setStatus] = useState<'none' | 'pending' | 'requested' | 'accepted'>('none');
  const [loading, setLoading] = useState(true);

  // Fetch the current friendship status between users
  const fetchFriendshipStatus = useCallback(async () => {
    if (!currentUserId || !otherUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Check for friendship from current user to other user
      const { data: outgoing, error: outgoingError } = await supabase
        .from('friendships')
        .select('status')
        .eq('user_id', currentUserId)
        .eq('friend_id', otherUserId)
        .single();

      if (outgoingError && outgoingError.code !== 'PGRST116') {
        console.error('Error checking outgoing friendship:', outgoingError);
      }

      // Check for friendship from other user to current user
      const { data: incoming, error: incomingError } = await supabase
        .from('friendships')
        .select('status')
        .eq('user_id', otherUserId)
        .eq('friend_id', currentUserId)
        .single();

      if (incomingError && incomingError.code !== 'PGRST116') {
        console.error('Error checking incoming friendship:', incomingError);
      }

      // Determine status based on both directions
      if (outgoing && outgoing.status === 'Accepted' && incoming && incoming.status === 'Accepted') {
        setStatus('accepted');
      } else if (outgoing && outgoing.status === 'Pending') {
        setStatus('requested');
      } else if (incoming && incoming.status === 'Pending') {
        setStatus('pending');
      } else {
        setStatus('none');
      }
      
    } catch (error) {
      console.error('Error in friendship check:', error);
      setStatus('none');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, otherUserId]);

  // Send a friend request
  const sendFriendRequest = useCallback(async () => {
    if (!currentUserId || !otherUserId) return false;
    
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUserId,
          friend_id: otherUserId,
          status: 'Pending'
        });
        
      if (error) throw error;
      
      // Update local status
      setStatus('requested');
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return false;
    }
  }, [currentUserId, otherUserId]);

  // Fetch status on component mount or when dependencies change
  useEffect(() => {
    fetchFriendshipStatus();
  }, [fetchFriendshipStatus]);

  return {
    status,
    loading,
    sendFriendRequest,
    refreshStatus: fetchFriendshipStatus
  };
};
