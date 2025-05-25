
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
import { Button } from '@/components/ui/button';

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

  // Filter friends based on search query - EXCLUDE current user
  useEffect(() => {
    if (!friends || !user) return;
    
    // Filter out the current user from friends list
    const friendsWithoutCurrentUser = friends.filter(friend => friend.id !== user.id);
    
    if (!friendsSearchQuery) {
      setFilteredFriends(friendsWithoutCurrentUser as UserProfile[]);
      return;
    }
    
    const query = friendsSearchQuery.toLowerCase();
    const filtered = friendsWithoutCurrentUser.filter(friend => 
      friend.username?.toLowerCase().includes(query) || 
      friend.location?.toLowerCase().includes(query) ||
      friend.status?.toLowerCase().includes(query)
    );
    
    setFilteredFriends(filtered as UserProfile[]);
  }, [friendsSearchQuery, friends, user]);

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
        {/* Clean header section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Friends
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Sign up or in to find your people
              </p>
            </div>
          </div>
        </div>

        {/* Sign up prompt */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-4">Sign up or in to find your people</h2>
              <p className="text-gray-600 mb-6">
                Connect with friends and discover new people in your area.
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean header section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Friends
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Find your crew. Join the People, Not Just the Plans.
            </p>
          </div>
        </div>
      </div>

      {/* Friends Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
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
      </div>
    </div>
  );
};

export default Friends;
