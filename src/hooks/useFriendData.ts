
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FriendsData, FriendRequest } from '@/types/friends';
import { UserProfile } from '@/types/index';

export const useFriendData = (userId: string | undefined) => {
  const [data, setData] = useState<FriendsData>({
    friends: [],
    requests: [],
    suggestions: [],
    allProfiles: []
  });
  const [loading, setLoading] = useState(true);
  const [pendingRequestIds, setPendingRequestIds] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);

  const fetchFriendsData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Fetching friends data for user:', userId);
      
      // Get accepted friendships only
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'Accepted');
      
      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
        throw friendshipsError;
      }
      
      // Get pending requests received by this user (separate query)
      const { data: receivedRequests, error: receivedError } = await supabase
        .from('friendships')
        .select('*')
        .eq('friend_id', userId)
        .eq('status', 'Pending');
      
      if (receivedError) {
        console.error('Error fetching received requests:', receivedError);
        throw receivedError;
      }
      
      // Get pending requests sent by this user
      const { data: sentRequests, error: sentError } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'Pending');
      
      if (sentError) {
        console.error('Error fetching sent requests:', sentError);
        throw sentError;
      }
      
      // Extract all user IDs to fetch profiles
      const friendIds = friendships?.map(friendship => 
        friendship.user_id === userId ? friendship.friend_id : friendship.user_id
      ) || [];
      
      const requestSenderIds = receivedRequests?.map(req => req.user_id) || [];
      const requestReceiverIds = sentRequests?.map(req => req.friend_id) || [];
      
      console.log('Friend IDs (only accepted):', friendIds);
      console.log('Request sender IDs:', requestSenderIds);
      console.log('Request receiver IDs:', requestReceiverIds);
      
      setPendingRequestIds(requestReceiverIds);
      
      // Combine all IDs (removing duplicates)
      const allIds = [...new Set([...friendIds, ...requestSenderIds, ...requestReceiverIds])];
      
      // Fetch all profiles at once if we have IDs
      let profiles: UserProfile[] = [];
      if (allIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', allIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }
        
        profiles = profilesData as UserProfile[];
      }
      
      // Process the data - ensure we only show accepted friends on friends page
      const friendProfiles = profiles.filter(profile => 
        friendIds.includes(profile.id)
      );
      
      // Create requests with profiles (received requests)
      const requestsWithProfiles = receivedRequests?.map(req => ({
        id: req.id,
        status: req.status.toLowerCase(),
        created_at: req.created_at,
        user_id: req.user_id,
        friend_id: req.friend_id,
        sender_id: req.user_id,
        receiver_id: req.friend_id,
        profile: profiles.find(p => p.id === req.user_id) as UserProfile
      })).filter(req => req.profile) as FriendRequest[];
      
      // Create sent requests with profiles
      const sentRequestsWithProfiles = sentRequests?.map(req => ({
        id: req.id,
        status: req.status.toLowerCase(),
        created_at: req.created_at,
        user_id: req.user_id,
        friend_id: req.friend_id,
        sender_id: req.user_id,
        receiver_id: req.friend_id,
        profile: profiles.find(p => p.id === req.friend_id) as UserProfile
      })).filter(req => req.profile) as FriendRequest[];
      
      setPendingRequests(sentRequestsWithProfiles);
      
      console.log('Friend profiles (accepted only):', friendProfiles);
      console.log('Requests with profiles:', requestsWithProfiles);
      
      setData({
        friends: friendProfiles,
        requests: requestsWithProfiles,
        suggestions: [],
        allProfiles: profiles
      });
    } catch (error) {
      console.error('Error in fetchFriendsData:', error);
      // Set empty data on error so the UI can still render
      setData({
        friends: [],
        requests: [],
        suggestions: [],
        allProfiles: []
      });
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchFriendsData();
    }
  }, [userId, fetchFriendsData]);

  return {
    loading,
    friends: data.friends || [],
    requests: data.requests || [],
    pendingRequests,
    pendingRequestIds,
    refreshFriendsData: fetchFriendsData
  };
};
