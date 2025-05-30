
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
        .select('id, status, created_at, user_id, friend_id')
        .eq('friend_id', userId)
        .eq('status', 'Pending');
        
      if (error) {
        console.error('Error fetching friend requests:', error);
        setRequests([]);
        setLoading(false);
        return;
      }
      
      if (!friendshipData || friendshipData.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // Get user IDs of request senders
      const senderIds = friendshipData.map(req => req.user_id);

      // Fetch profiles for these users in a separate query
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, email, location, location_category, status, status_details, tagline')
        .in('id', senderIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setRequests([]);
        setLoading(false);
        return;
      }

      // Create a map for quick profile lookup
      const profileMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);
      
      // Process the data into the correct format, filtering out any without profiles
      const processedRequests: FriendRequest[] = friendshipData
        .map(req => {
          const profile = profileMap.get(req.user_id);
          if (!profile) return null;
          
          const friendRequest: FriendRequest = {
            id: req.id,
            status: 'pending' as const,
            created_at: req.created_at,
            user_id: req.user_id,
            friend_id: req.friend_id,
            sender_id: req.user_id,
            receiver_id: req.friend_id,
            profile: profile as any
          };
          
          return friendRequest;
        })
        .filter((req): req is FriendRequest => req !== null);
      
      setRequests(processedRequests);
      
    } catch (err) {
      console.error('Error in fetchRequests:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    if (userId) {
      fetchRequests();
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('friendship-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `friend_id=eq.${userId}`,
        }, () => {
          fetchRequests();
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
      
      // Remove the request from local state
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      
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
      
      // Remove the request from local state
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      
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
