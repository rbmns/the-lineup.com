
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsHeader } from '@/components/friends/FriendsHeader';
import { FriendsTabsNew } from '@/components/friends/FriendsTabsNew';
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { DiscoverTabContent } from '@/components/friends/DiscoverTabContent';
import { SuggestedFriendsTabContent } from '@/components/friends/SuggestedFriendsTabContent';
import { FriendsEventsTabContent } from '@/components/friends/FriendsEventsTabContent';
import { FriendsCasualPlansTabContent } from '@/components/friends/FriendsCasualPlansTabContent';
import { useFriends } from '@/hooks/useFriends';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { useSuggestedFriends } from '@/hooks/useSuggestedFriends';

const FriendsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all-friends');
  const [searchQuery, setSearchQuery] = useState('');

  const { friends, loading: friendsLoading } = useFriends(user?.id);
  const { requests, loading: requestsLoading, handleAcceptRequest, handleDeclineRequest } = useFriendRequests(user?.id);
  const { suggestedFriends, loading: suggestionsLoading } = useSuggestedFriends(user?.id);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFriends = friends.filter(friend =>
    friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get friend IDs for the events and casual plans tabs
  const friendIds = friends.map(friend => friend.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <FriendsHeader />
      <FriendsTabsNew
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRequestsCount={requests.length}
        suggestedFriendsCount={suggestedFriends.length}
        allFriendsContent={
          <FriendsTabContent
            friends={filteredFriends}
            loading={friendsLoading}
            requests={requests}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            showFriendRequests={false}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        }
        suggestionsContent={
          <SuggestedFriendsTabContent
            suggestedFriends={suggestedFriends}
            loading={suggestionsLoading}
            onAddFriend={async (friendId: string) => {
              // TODO: Implement add friend functionality
              console.log('Add friend:', friendId);
            }}
            onDismiss={(friendId: string) => {
              // TODO: Implement dismiss functionality
              console.log('Dismiss suggestion:', friendId);
            }}
            currentUserId={user?.id}
            friendIds={friendIds}
          />
        }
        requestsContent={
          <FriendsTabContent
            friends={[]}
            loading={requestsLoading}
            requests={requests}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            showFriendRequests={true}
          />
        }
        eventsContent={
          <FriendsEventsTabContent 
            friendIds={friendIds}
            currentUserId={user?.id}
            friends={friends}
          />
        }
        casualPlansContent={
          <FriendsCasualPlansTabContent 
            friendIds={friendIds}
            currentUserId={user?.id}
          />
        }
      />
    </div>
  );
};

export default FriendsPage;
