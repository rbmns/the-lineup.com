
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFriendData } from '@/hooks/useFriendData';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { useSuggestedFriends } from '@/hooks/useSuggestedFriends';
import { useFriendsSearch } from '@/hooks/useFriendsSearch';
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { DiscoverTabContent } from '@/components/friends/DiscoverTabContent';
import { SuggestedFriendsTabContent } from '@/components/friends/SuggestedFriendsTabContent';
import { FriendsHeader } from '@/components/friends/FriendsHeader';
import { FriendsTabsNew } from '@/components/friends/FriendsTabsNew';

import { supabase } from '@/lib/supabase';

export const FriendsMainContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all-friends');

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

  // Get suggested friends functionality
  const {
    suggestedFriends,
    loading: suggestedLoading,
    dismissSuggestion,
    refreshSuggestions
  } = useSuggestedFriends(user?.id);

  // Search functionality
  const {
    searchQuery,
    searchResults,
    isSearching,
    handleSearchChange,
    setSearchQuery,
    setSearchResults
  } = useFriendsSearch(user, friends);

  // Handle search manually
  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .neq('id', user.id)
        .limit(10);
        
      if (error) throw error;
      
      const friendIds = friends?.map(f => f.id) || [];
      const filteredResults = (data || []).filter(profile => 
        !friendIds.includes(profile.id) && profile.id !== user.id
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching for users:', error);
    }
  };

  // Filter friends based on search query - EXCLUDE current user
  const filteredFriends = React.useMemo(() => {
    if (!friends || !user) return [];
    
    // Filter out the current user from friends list
    const friendsWithoutCurrentUser = friends.filter(friend => friend.id !== user.id);
    
    if (!searchQuery) {
      return friendsWithoutCurrentUser;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = friendsWithoutCurrentUser.filter(friend => 
      friend.username?.toLowerCase().includes(query) || 
      friend.location?.toLowerCase().includes(query) ||
      friend.status?.toLowerCase().includes(query)
    );
    
    return filtered;
  }, [searchQuery, friends, user]);

  // Get friend IDs and pending request IDs for filtering suggestions
  const friendIds = React.useMemo(() => {
    return friends?.map(friend => friend.id) || [];
  }, [friends]);

  // Filter suggested friends to exclude those we already sent requests to
  const filteredSuggestedFriends = React.useMemo(() => {
    if (!suggestedFriends || !pendingRequestIds) return suggestedFriends;
    
    return suggestedFriends.filter(friend => 
      !pendingRequestIds.includes(friend.id) && 
      !friendIds.includes(friend.id)
    );
  }, [suggestedFriends, pendingRequestIds, friendIds]);

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
      
      refreshFriendsData();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Handle adding a suggested friend
  const handleAddSuggestedFriend = async (friendId: string) => {
    await handleAddFriend(friendId);
    refreshSuggestions();
  };

  // Handle dismissing a suggested friend
  const handleDismissSuggestion = (friendId: string) => {
    dismissSuggestion(friendId);
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

  const pendingRequestsCount = requests?.length || 0;
  const suggestedFriendsCount = filteredSuggestedFriends?.length || 0;

  return (
    <div className="min-h-screen">
      <FriendsHeader />
      

      {/* Friends Content */}
      <div className="max-w-screen-lg mx-auto px-6 pb-6 md:pb-8">
        <FriendsTabsNew
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingRequestsCount={pendingRequestsCount}
          suggestedFriendsCount={suggestedFriendsCount}
          allFriendsContent={
            <FriendsTabContent
              friends={filteredFriends}
              loading={friendsLoading}
              requests={requests || []}
              onAcceptRequest={onAcceptRequest}
              onDeclineRequest={onDeclineRequest}
              showFriendRequests={false}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
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
          suggestionsContent={
            <SuggestedFriendsTabContent
              suggestedFriends={filteredSuggestedFriends}
              loading={suggestedLoading}
              onAddFriend={handleAddSuggestedFriend}
              onDismiss={handleDismissSuggestion}
              currentUserId={user?.id}
              friendIds={friendIds}
            />
          }
          requestsContent={
            <FriendsTabContent
              friends={[]}
              loading={requestsLoading}
              requests={requests || []}
              onAcceptRequest={onAcceptRequest}
              onDeclineRequest={onDeclineRequest}
              showFriendRequests={true}
              searchQuery={undefined}
              onSearchChange={undefined}
            />
          }
        />
      </div>
    </div>
  );
};
