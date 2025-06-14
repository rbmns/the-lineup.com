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
import { FriendsCasualPlansTabContent } from '@/components/friends/FriendsCasualPlansTabContent';
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

  // Get friend IDs for events and casual plans queries
  const friendIds = React.useMemo(() => {
    return friends?.map(friend => friend.id) || [];
  }, [friends]);

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
  const suggestedFriendsCount = suggestedFriends?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <FriendsHeader />
      
      <div className="px-4">
        <FriendsSearchSection 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Friends Content */}
      <div className="container mx-auto px-4 pb-6 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
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
                  // Remove searchQuery and onSearchChange to hide the duplicate search bar
                  searchQuery={undefined}
                  onSearchChange={undefined}
                />
              }
              suggestionsContent={
                <SuggestedFriendsTabContent
                  suggestedFriends={suggestedFriends}
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
                  // Remove searchQuery and onSearchChange to hide the duplicate search bar
                  searchQuery={undefined}
                  onSearchChange={undefined}
                />
              }
              eventsContent={
                <FriendsEventsTabContent 
                  friendIds={friendIds}
                  currentUserId={user.id}
                  friends={friends || []}
                />
              }
              casualPlansContent={
                <FriendsCasualPlansTabContent 
                  friendIds={friendIds}
                  currentUserId={user.id}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
