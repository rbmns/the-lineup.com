import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFriends } from '@/hooks/useFriends';
import { pageSeoTags } from '@/utils/seoUtils';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { DiscoverTabContent } from '@/components/friends/DiscoverTabContent';
import { FriendsTabs } from '@/components/friends/FriendsTabs';
import { LoginPrompt } from '@/components/friends/LoginPrompt';
import { useQueryClient } from '@tanstack/react-query';

const Friends = () => {
  const { user, loading: authLoading } = useAuth();
  const { friends, loading: friendsLoading, pendingRequestIds, refreshFriendsData } = useFriends(user?.id);
  const { 
    requests, 
    handleAcceptRequest, 
    handleDeclineRequest, 
    refreshRequests 
  } = useFriendRequests(user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up page SEO
    document.title = pageSeoTags.friends.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.friends.description);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageSeoTags.friends.title);
    if (ogDesc) ogDesc.setAttribute('content', pageSeoTags.friends.description);

    // Set keywords meta tag
    let keywordsTag = document.querySelector('meta[name="keywords"]');
    if (!keywordsTag) {
      keywordsTag = document.createElement('meta');
      keywordsTag.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsTag);
    }
    keywordsTag.setAttribute('content', pageSeoTags.friends.keywords || '');
  }, []);
  
  // Update pending request count
  useEffect(() => {
    if (requests && Array.isArray(requests)) {
      setPendingRequestsCount(requests.length);
      console.log('Updated pending requests count:', requests.length);
    }
  }, [requests]);

  // Debounced search function for discovery tab
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2 && activeTab === 'discover') {
        handleSearch();
      } else if (searchQuery.trim().length === 0) {
        setSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);
  
  // Refresh friends data when the component mounts or tab changes to friends
  useEffect(() => {
    if (user?.id && activeTab === 'friends') {
      console.log('Refreshing friends data due to tab change');
      refreshFriendsData();
      refreshRequests();
    }
  }, [user?.id, activeTab, refreshFriendsData, refreshRequests]);

  const handleSearch = async () => {
    if (!user?.id || searchQuery.trim().length < 2) {
      return;
    }
    
    setIsSearching(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .or(`username.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,status.ilike.%${searchQuery}%`)
        .order('username');
      
      if (error) throw error;
      
      console.log('Search results:', data);
      setSearchResults(data || []);
    } catch (err) {
      console.error('Error searching for users:', err);
      toast({
        title: "Error",
        description: "Failed to search for users",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddFriend = async (friendId) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add friends",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'Pending'
        });
      
      if (error) throw error;
      
      // Update pendingRequestIds list to show pending status on UI
      pendingRequestIds.push(friendId);
      
      // Refresh the friends data
      refreshFriendsData();
    } catch (err) {
      console.error('Error sending friend request:', err);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive"
      });
    }
  };

  // Handle accepting friend requests with immediate UI refresh
  const handleAcceptFriendRequest = async (requestId) => {
    console.log('Accepting friend request:', requestId);
    const result = await handleAcceptRequest(requestId);
    if (result) {
      console.log('Friend request accepted, refreshing data');
      // Update pending request count immediately
      setPendingRequestsCount(prev => Math.max(0, prev - 1));
      
      // Refresh the friends list immediately after accepting a request
      refreshFriendsData();
      
      // Invalidate any friend-related queries
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
    return result;
  };

  // Handle declining friend requests with immediate UI refresh
  const handleDeclineFriendRequest = async (requestId) => {
    console.log('Declining friend request:', requestId);
    const result = await handleDeclineRequest(requestId);
    if (result) {
      console.log('Friend request declined, refreshing data');
      // Update pending request count immediately
      setPendingRequestsCount(prev => Math.max(0, prev - 1));
      
      // Refresh the friends list immediately after declining a request
      refreshFriendsData();
      
      // Invalidate any friend-related queries
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
    return result;
  };

  // Convert FriendRequest[] to the format expected by FriendRequests component
  const formattedRequests = requests.map(req => ({
    id: req.id,
    profile: req.profile
  }));

  if (authLoading) {
    return <div className="container py-8 px-4 max-w-4xl mx-auto">Loading...</div>;
  }

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      
      <FriendsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRequestsCount={pendingRequestsCount}
        friendsContent={
          <FriendsTabContent
            friends={friends || []}
            loading={friendsLoading || authLoading}
            requests={formattedRequests}
            onAcceptRequest={handleAcceptFriendRequest}
            onDeclineRequest={handleDeclineFriendRequest}
            showFriendRequests={showFriendRequests}
          />
        }
        discoverContent={
          <DiscoverTabContent
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            searchResults={searchResults}
            onAddFriend={handleAddFriend}
            isSearching={isSearching}
            pendingRequestIds={pendingRequestIds}
          />
        }
      />
    </div>
  );
};

export default Friends;
