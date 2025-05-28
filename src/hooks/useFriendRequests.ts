
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FriendRequest } from '@/types/friends';

export const useFriendRequests = (userId: string | undefined) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get requests sent to this user
      const { data: friendshipData, error } = await supabase
        .from('friendships')
        .select('*')
        .eq('friend_id', userId)
        .eq('status', 'Pending');
        
      if (error) throw error;
      
      // Fetch user profiles separately to avoid foreign key issues
      if (friendshipData.length > 0) {
        const senderIds = friendshipData.map(req => req.user_id);
        
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', senderIds);
          
        if (profileError) throw profileError;
        
        // Process the data into the friendships format
        const processedRequests = friendshipData.map(req => ({
          id: req.id,
          status: req.status.toLowerCase(),
          created_at: req.created_at,
          user_id: req.user_id,
          friend_id: req.friend_id,
          profile: profiles?.find(p => p.id === req.user_id)
        })).filter(req => req.profile);
        
        setRequests(processedRequests);
      } else {
        setRequests([]);
      }
      
      // Check for recently accepted outgoing friend requests
      const { data: acceptedRequests, error: acceptedError } = await supabase
        .from('friendships')
        .select('*, profiles!friendships_friend_id_fkey(*)')
        .eq('user_id', userId)
        .eq('status', 'Accepted')
        .order('updated_at', { ascending: false })
        .limit(5);  // Only check recent acceptances
        
      if (acceptedError) throw acceptedError;
      
      // No toast notifications for accepted requests now
      
    } catch (err) {
      console.error('Error fetching friend requests:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    if (userId) {
      fetchRequests();
      
      // Set up real-time subscription to friendships table
      const subscription = supabase
        .channel('friendship-status-changes')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'friendships',
          filter: `user_id=eq.${userId}`,
        }, (payload) => {
          // If status changed to Accepted, no toast notification now
          if (payload.new && payload.new.status === 'Accepted') {
            // Just refresh requests data
            fetchRequests();
          }
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId, fetchRequests]);
  
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'Accepted' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Remove the request from the local state
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      
      // No toast for accepting a request
      
      return true;
    } catch (err) {
      console.error('Error accepting friend request:', err);
      return false;
    }
  };
  
  const handleDeclineRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'Removed' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Remove the request from the local state
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      
      // No toast notification for declined request
      
      return true;
    } catch (err) {
      console.error('Error declining friend request:', err);
      return false;
    }
  };

  return {
    requests,
    loading,
    handleAcceptRequest,
    handleDeclineRequest,
    refreshRequests: fetchRequests
  };
};
