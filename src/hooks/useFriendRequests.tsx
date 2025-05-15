
import { useState, useEffect, useCallback } from 'react';
import { FriendRequest } from '@/types/friends';
import { 
  fetchPendingRequests, 
  checkRecentlyAcceptedRequests,
  acceptFriendRequest, 
  declineFriendRequest,
  setupFriendshipSubscription
} from './useFriendRequestUtils';

export const useFriendRequests = (userId: string | undefined) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Main function to fetch all friend request data
  const fetchRequests = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get pending requests
      const pendingRequests = await fetchPendingRequests(userId);
      setRequests(pendingRequests);
      
      // Check for recently accepted requests
      await checkRecentlyAcceptedRequests(userId);
      
    } catch (err) {
      console.error('Error in useFriendRequests:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Set up initial fetch and realtime subscription
  useEffect(() => {
    if (userId) {
      fetchRequests();
      
      // Set up real-time subscription
      const cleanup = setupFriendshipSubscription(userId, fetchRequests);
        
      return cleanup;
    }
  }, [userId, fetchRequests]);
  
  // Handle accepting a friend request
  const handleAcceptRequest = async (requestId: string) => {
    const success = await acceptFriendRequest(requestId);
    
    if (success) {
      // Remove the request from the local state
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    }
    
    return success;
  };
  
  // Handle declining a friend request
  const handleDeclineRequest = async (requestId: string) => {
    const success = await declineFriendRequest(requestId);
    
    if (success) {
      // Remove the request from the local state
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    }
    
    return success;
  };

  return {
    requests,
    loading,
    handleAcceptRequest,
    handleDeclineRequest,
    refreshRequests: fetchRequests
  };
};
