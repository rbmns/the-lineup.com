
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFriendData } from '@/hooks/useFriendData';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { UserProfile } from '@/types';
import { DiscoverTabContent } from '@/components/friends/DiscoverTabContent';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { SuggestedFriendsTabContent } from '@/components/friends/SuggestedFriendsTabContent';
import { useSuggestedFriends } from '@/hooks/useSuggestedFriends';
import { FriendsHeader } from '@/components/friends/FriendsHeader';
import { FriendsTabsNew } from '@/components/friends/FriendsTabsNew';
import { FriendsEventsTabContent } from '@/components/friends/FriendsEventsTabContent';
import { Search } from 'lucide-react';

const Friends: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all-friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  // Handle search for new people - EXCLUDE current user
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
      
      // Filter out users who are already friends AND exclude current user
      const friendIds = friends?.map(f => f.id) || [];
      const filteredResults = (data || []).filter(profile => 
        !friendIds.includes(profile.id) && profile.id !== user.id
      );
      
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

  // Handle adding a suggested friend
  const handleAddSuggestedFriend = async (friendId: string) => {
    await handleAddFriend(friendId);
    refreshSuggestions(); // Refresh suggestions after adding friend
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

  // Effect to trigger search when typing in discover tab
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      handleSearch();
    }
  }, [searchQuery, handleSearch]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FriendsHeader />

        {/* Search Bar */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search friends by name..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Sign up prompt */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-4">Sign up or in to see others</h2>
              <p className="text-gray-600 mb-6">
                Connect with friends and discover new things in your area.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/signup')} 
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Sign Up
                </Button>
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="outline"
                  className="w-full"
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingRequestsCount = requests?.length || 0;
  const suggestedFriendsCount = suggestedFriends?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <FriendsHeader />

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
        </div>
      </div>

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
