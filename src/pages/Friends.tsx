
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFriendData } from '@/hooks/useFriendData';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { useSuggestedFriends } from '@/hooks/useSuggestedFriends';
import { useFriendsSearch } from '@/hooks/useFriendsSearch';
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { SuggestedFriendsTabContent } from '@/components/friends/SuggestedFriendsTabContent';
import { FriendsHeader } from '@/components/friends/FriendsHeader';
import { FriendsTabsNew } from '@/components/friends/FriendsTabsNew';
import { FriendsEventsTabContent } from '@/components/friends/FriendsEventsTabContent';
import { FriendsSearchSection } from '@/components/friends/FriendsSearchSection';
import { FriendsLoginPrompt } from '@/components/friends/FriendsLoginPrompt';
import { UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';
import React from 'react';

const Friends: React.FC = () => {
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

  // Filter friends based on search query - EXCLUDE current user
  const filteredFriends = React.useMemo(() => {
    if (!friends || !user) return [];
    
    // Filter out the current user from friends list
    const friendsWithoutCurrentUser = friends.filter(friend => friend.id !== user.id);
    
    if (!searchQuery) {
      return friendsWithoutCurrentUser as UserProfile[];
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = friendsWithoutCurrentUser.filter(friend => 
      friend.username?.toLowerCase().includes(query) || 
      friend.location?.toLowerCase().includes(query) ||
      friend.status?.toLowerCase().includes(query)
    );
    
    return filtered as UserProfile[];
  }, [searchQuery, friends, user]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FriendsHeader />
        <FriendsSearchSection 
          searchQuery=""
          onSearchChange={() => {}}
          disabled={true}
        />
        <FriendsLoginPrompt />
      </div>
    );
  }

  const pendingRequestsCount = requests?.length || 0;
  const suggestedFriendsCount = suggestedFriends?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <FriendsHeader />
      
      <FriendsSearchSection 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Friends Content */}
      <div className="container mx-auto px-4 pb-6 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <FriendsTabsNew
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              pendingRequestsCount={pendingRequestsCount}
              suggestedFriendsCount={suggestedFriendsCount}
              allFriendsContent={
                <FriendsTabContent
                  friends={filteredFriends as UserProfile[]}
                  loading={friendsLoading}
                  requests={requests || []}
                  onAcceptRequest={onAcceptRequest}
                  onDeclineRequest={onDeclineRequest}
                  showFriendRequests={false}
                  searchQuery=""
                  onSearchChange={() => {}}
                />
              }
              suggestionsContent={
                <SuggestedFriendsTabContent
                  suggestedFriends={suggestedFriends}
                  loading={suggestedLoading}
                  onAddFriend={handleAddSuggestedFriend}
                  onDismiss={handleDismissSuggestion}
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
                  searchQuery=""
                  onSearchChange={() => {}}
                />
              }
              eventsContent={
                <FriendsEventsTabContent />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
