
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useFriendship = (currentUserId?: string, otherUserId?: string) => {
  const [status, setStatus] = useState<'none' | 'pending' | 'requested' | 'accepted'>('none');
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  // New method: initiateFriendRequest - same functionality as sendFriendRequest but with a different name for consistency
  const initiateFriendRequest = useCallback(async (friendId?: string) => {
    setIsLoading(true);
    const targetUserId = friendId || otherUserId;
    if (!currentUserId || !targetUserId) {
      setIsLoading(false);
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUserId,
          friend_id: targetUserId,
          status: 'Pending'
        });
        
      if (error) throw error;
      
      // Update local status
      if (targetUserId === otherUserId) {
        setStatus('requested');
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      setIsLoading(false);
      return false;
    }
  }, [currentUserId, otherUserId]);

  // New method: acceptFriendRequest
  const acceptFriendRequest = useCallback(async (friendId?: string) => {
    setIsLoading(true);
    const targetUserId = friendId || otherUserId;
    if (!currentUserId || !targetUserId) {
      setIsLoading(false);
      return false;
    }
    
    try {
      // Find the friendship request
      const { data, error: findError } = await supabase
        .from('friendships')
        .select('id')
        .eq('user_id', targetUserId)
        .eq('friend_id', currentUserId)
        .eq('status', 'Pending')
        .maybeSingle();
      
      if (findError) throw findError;
      if (!data) throw new Error('Friend request not found');
      
      // Update the status to Accepted
      const { error: updateError } = await supabase
        .from('friendships')
        .update({ 
          status: 'Accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
      
      // If we're accepting a request from the focused other user, update local status
      if (targetUserId === otherUserId) {
        setStatus('accepted');
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setIsLoading(false);
      return false;
    }
  }, [currentUserId, otherUserId]);

  // New method: declineFriendRequest
  const declineFriendRequest = useCallback(async (friendId?: string) => {
    setIsLoading(true);
    const targetUserId = friendId || otherUserId;
    if (!currentUserId || !targetUserId) {
      setIsLoading(false);
      return false;
    }
    
    try {
      // Find the friendship request
      const { data, error: findError } = await supabase
        .from('friendships')
        .select('id')
        .eq('user_id', targetUserId)
        .eq('friend_id', currentUserId)
        .eq('status', 'Pending')
        .maybeSingle();
      
      if (findError) throw findError;
      if (!data) throw new Error('Friend request not found');
      
      // Update the request to Removed status
      const { error: updateError } = await supabase
        .from('friendships')
        .update({ 
          status: 'Removed',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
      
      // If we're declining a request from the focused other user, update local status
      if (targetUserId === otherUserId) {
        setStatus('none');
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error declining friend request:', error);
      setIsLoading(false);
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
    isLoading,
    sendFriendRequest,
    refreshStatus: fetchFriendshipStatus,
    initiateFriendRequest,
    acceptFriendRequest,
    declineFriendRequest
  };
};
