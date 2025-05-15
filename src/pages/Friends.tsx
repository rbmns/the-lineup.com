
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFriendData } from '@/hooks/useFriendData';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { FriendsTabs } from '@/components/friends/FriendsTabs';
import { UserProfile } from '@/types';
import { DiscoverTabContent } from '@/components/friends/DiscoverTabContent';
import { supabase } from '@/lib/supabase';

const Friends: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [friendsSearchQuery, setFriendsSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<UserProfile[]>([]);

  // Fetch friend data including current friends list
  const { 
    friends,
    requests: friendRequests,
    loading: friendsLoading,
    refreshFriendsData,
    pendingRequestIds
  } = useFriendData(user?.id);

  // Get friend request handling functionality
  const {
    requests,
    loading: requestsLoading,
    handleAcceptRequest,
    handleDeclineRequest,
    refreshRequests
  } = useFriendRequests(user?.id);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Filter friends based on search query
  useEffect(() => {
    if (!friends) return;
    
    if (!friendsSearchQuery) {
      setFilteredFriends(friends as UserProfile[]);
      return;
    }
    
    const query = friendsSearchQuery.toLowerCase();
    const filtered = friends.filter(friend => 
      friend.username?.toLowerCase().includes(query) || 
      friend.location?.toLowerCase().includes(query) ||
      friend.status?.toLowerCase().includes(query)
    );
    
    setFilteredFriends(filtered as UserProfile[]);
  }, [friendsSearchQuery, friends]);

  // Handle search for new people
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !user) return;
    
    setIsSearching(true);
    
    try {
      // Search for users by username or location
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .neq('id', user.id) // Exclude the current user
        .limit(10);
        
      if (error) throw error;
      
      // Filter out users who are already friends
      const friendIds = friends?.map(f => f.id) || [];
      const filteredResults = (data || []).filter(profile => !friendIds.includes(profile.id));
      
      setSearchResults(filteredResults as UserProfile[]);
    } catch (error) {
      console.error('Error searching for users:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, user, friends]);

  // Handle search when typing in discover tab
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
    }
  };

  // Handle sending a friend request
  const handleAddFriend = async (friendId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'Pending'
        });
        
      if (error) throw error;
      
      // Update pending request IDs
      refreshFriendsData();
      
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Handle accepting a friend request with refresh
  const onAcceptRequest = async (requestId: string) => {
    const success = await handleAcceptRequest(requestId);
    if (success) {
      refreshFriendsData();
    }
    return success;
  };

  // Handle declining a friend request
  const onDeclineRequest = async (requestId: string) => {
    const success = await handleDeclineRequest(requestId);
    if (success) {
      refreshRequests();
    }
    return success;
  };

  // Effect to trigger search when Enter key is pressed
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && activeTab === 'discover') {
        handleSearch();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [activeTab, handleSearch]);

  if (!user) {
    return null; // Will redirect in the effect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <FriendsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingRequestsCount={requests?.length || 0}
          friendsContent={
            <FriendsTabContent
              friends={filteredFriends as UserProfile[]}
              loading={friendsLoading}
              requests={requests || []}
              onAcceptRequest={onAcceptRequest}
              onDeclineRequest={onDeclineRequest}
              showFriendRequests={true}
              searchQuery={friendsSearchQuery}
              onSearchChange={(e) => setFriendsSearchQuery(e.target.value)}
            />
          }
          discoverContent={
            <DiscoverTabContent
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchResults={searchResults}
              onAddFriend={handleAddFriend}
              isSearching={isSearching}
              pendingRequestIds={pendingRequestIds || []}
              onSearch={handleSearch}
            />
          }
        />
      </div>
    </div>
  );
};

export default Friends;
