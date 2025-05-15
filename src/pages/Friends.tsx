import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsList } from '@/components/friends/FriendsList';
import { FriendSearch } from '@/components/friends/FriendSearch';
import { FriendCard } from '@/components/profile/FriendCard';
import { FriendRequests } from '@/components/friends/FriendRequests';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginPrompt } from '@/components/friends/LoginPrompt';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { supabase } from '@/lib/supabase';
import { FriendsTabs } from '@/components/friends/FriendsTabs';
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { DiscoverTabContent } from '@/components/friends/DiscoverTabContent';
import { FriendRequestsSection } from '@/components/friends/FriendRequestsSection';
import { useUserEvents } from '@/hooks/useUserEvents';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { UserProfile } from '@/types';

const Friends = () => {
  const { user, isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [friendsList, setFriendsList] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<UserProfile[]>([]);
  const [sentRequests, setSentRequests] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Import event-related hooks
  const { 
    userEvents, 
    isLoading: isUserEventsLoading,
    upcomingEvents,
    pastEvents,
    refetch 
  } = useUserEvents(user?.id, user?.id, 'accepted');
  
  const { handleRsvp: handleEventRsvp } = useRsvpActions();
  
  useEffect(() => {
    document.title = 'Friends';

    // Redirect to login if not authenticated
    if (!isAuthenticated && !user) {
      navigate('/login', { state: { from: '/friends' } });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchFriendsData = async () => {
      try {
        setIsLoading(true);

        // Fetch current user's friends
        const { data: friendsData, error: friendsError } = await supabase
          .from('friendships')
          .select(`
            friend_id,
            profiles!friendships_friend_id_fkey (
              id,
              username,
              avatar_url,
              status
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'accepted');

        if (friendsError) throw friendsError;

        // Fetch friend requests received
        const { data: requestsData, error: requestsError } = await supabase
          .from('friendships')
          .select(`
            user_id,
            profiles!friendships_user_id_fkey (
              id,
              username,
              avatar_url,
              status
            )
          `)
          .eq('friend_id', user.id)
          .eq('status', 'pending');

        if (requestsError) throw requestsError;

        // Fetch friend requests sent
        const { data: sentData, error: sentError } = await supabase
          .from('friendships')
          .select(`
            friend_id,
            profiles!friendships_friend_id_fkey (
              id,
              username,
              avatar_url,
              status
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'pending');

        if (sentError) throw sentError;

        // Format the friends data
        const formattedFriends = friendsData?.map(item => ({
          id: item.profiles?.id,
          username: item.profiles?.username,
          avatar_url: item.profiles?.avatar_url,
          status: item.profiles?.status,
        })).filter(item => item.id) || [];

        // Format the requests data
        const formattedRequests = requestsData?.map(item => ({
          id: item.profiles?.id,
          username: item.profiles?.username,
          avatar_url: item.profiles?.avatar_url,
          status: item.profiles?.status,
        })).filter(item => item.id) || [];

        // Format the sent requests data
        const formattedSentRequests = sentData?.map(item => ({
          id: item.profiles?.id,
          username: item.profiles?.username,
          avatar_url: item.profiles?.avatar_url,
          status: item.profiles?.status,
        })).filter(item => item.id) || [];

        setFriendsList(formattedFriends);
        setFriendRequests(formattedRequests);
        setSentRequests(formattedSentRequests);
      } catch (error) {
        console.error('Error fetching friends data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendsData();
  }, [user]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${query}%`)
        .neq('id', user?.id || '') // Don't include current user
        .limit(10);

      if (error) throw error;
      
      // Filter out users that are already friends or have pending requests
      const filteredResults = data.filter(result => {
        const isAlreadyFriend = friendsList.some(friend => friend.id === result.id);
        const hasPendingRequest = friendRequests.some(request => request.id === result.id);
        const hasSentRequest = sentRequests.some(sent => sent.id === result.id);
        return !isAlreadyFriend && !hasPendingRequest && !hasSentRequest;
      });
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendFriendRequest = async (friendId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .insert([
          { user_id: user.id, friend_id: friendId, status: 'pending' }
        ]);

      if (error) throw error;

      // Update UI
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, status')
        .eq('id', friendId)
        .single();

      setSentRequests([...sentRequests, data]);
      
      // Remove from search results
      setSearchResults(prevResults => 
        prevResults.filter(result => result.id !== friendId)
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptFriendRequest = async (friendId: string) => {
    if (!user) return;

    try {
      // Update the friendship status
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('user_id', friendId)
        .eq('friend_id', user.id);

      if (error) throw error;

      // Create reverse friendship entry
      await supabase
        .from('friendships')
        .insert([
          { user_id: user.id, friend_id: friendId, status: 'accepted' }
        ]);

      // Update UI
      const acceptedFriend = friendRequests.find(req => req.id === friendId);
      if (acceptedFriend) {
        setFriendsList([...friendsList, acceptedFriend]);
        setFriendRequests(friendRequests.filter(req => req.id !== friendId));
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineFriendRequest = async (friendId: string) => {
    if (!user) return;

    try {
      // Delete the friendship request
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', user.id);

      if (error) throw error;

      // Update UI
      setFriendRequests(friendRequests.filter(req => req.id !== friendId));
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  const handleCancelFriendRequest = async (friendId: string) => {
    if (!user) return;

    try {
      // Delete the sent request
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);

      if (error) throw error;

      // Update UI
      setSentRequests(sentRequests.filter(req => req.id !== friendId));
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;

    try {
      // Delete both friendship records
      await supabase
        .from('friendships')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);

      await supabase
        .from('friendships')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', user.id);

      // Update UI
      setFriendsList(friendsList.filter(friend => friend.id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (handleEventRsvp) {
      await handleEventRsvp(eventId, status);
      refetch();
    }
    return true;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar with user profile */}
        <div className="lg:col-span-1">
          {profile && (
            <ProfileCard profile={profile} />
          )}
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="friends" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="friends" className="flex-1">My Friends</TabsTrigger>
              <TabsTrigger value="discover" className="flex-1">Discover</TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">
                Friend Requests
                {friendRequests.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {friendRequests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="friends">
              {isLoading ? (
                <div className="text-center py-8">Loading friends...</div>
              ) : (
                <div className="space-y-6">
                  {friendsList.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any friends yet.</p>
                      <Button onClick={() => setActiveTab('discover')}>
                        Discover People
                      </Button>
                    </div>
                  ) : (
                    <>
                      <FriendsList 
                        friends={friendsList}
                      />
                    </>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="discover">
              <div className="space-y-6">
                <FriendSearch 
                  query={searchQuery}
                  onQueryChange={handleSearch}
                  isSearching={isSearching} 
                />
                
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map(user => (
                      <FriendCard
                        key={user.id}
                        profile={user}
                        relationship="none"
                        onAddFriend={() => handleSendFriendRequest(user.id)}
                        actionLabel="Send Request"
                      />
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No users found matching "{searchQuery}"</p>
                  </div>
                ) : null}
                
                {sentRequests.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4">Sent Requests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sentRequests.map(user => (
                        <FriendCard
                          key={user.id}
                          profile={user}
                          relationship="sent"
                          onAction={() => handleCancelFriendRequest(user.id)}
                          actionLabel="Cancel Request"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="requests">
              {isLoading ? (
                <div className="text-center py-8">Loading requests...</div>
              ) : (
                <>
                  {friendRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You don't have any friend requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {friendRequests.map(user => (
                        <FriendCard
                          key={user.id}
                          profile={user}
                          relationship="received"
                          onAction={() => handleAcceptFriendRequest(user.id)}
                          onSecondaryAction={() => handleDeclineFriendRequest(user.id)}
                          actionLabel="Accept"
                          secondaryActionLabel="Decline"
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Friends;
