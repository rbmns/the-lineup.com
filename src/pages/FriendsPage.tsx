
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsHeader } from '@/components/friends/FriendsHeader';
import { useFriends } from '@/hooks/useFriends';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { useSuggestedFriends } from '@/hooks/useSuggestedFriends';
import { FriendsPageLayout } from '@/components/friends/FriendsPageLayout';

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

  const friendIds = friends.map(friend => friend.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FriendsHeader />
        
        <FriendsPageLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          friends={filteredFriends}
          requests={requests}
          suggestedFriends={suggestedFriends}
          loading={friendsLoading || requestsLoading || suggestionsLoading}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
          currentUserId={user?.id}
          friendIds={friendIds}
        />
      </div>
    </div>
  );
};

export default FriendsPage;
