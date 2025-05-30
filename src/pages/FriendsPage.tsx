
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsHeader } from '@/components/friends/FriendsHeader';
import { FriendsTabs } from '@/components/friends/FriendsTabs';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <FriendsHeader />
      <FriendsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRequestsCount={requests.length}
        friendsContent={
          <div className="space-y-6">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="bg-white rounded-lg border p-4 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {friend.username ? friend.username.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{friend.username}</h3>
                  <p className="text-sm text-gray-500">{friend.location}</p>
                </div>
                <button className="text-blue-500 text-sm">View Profile</button>
              </div>
            ))}
          </div>
        }
        discoverContent={
          <div className="space-y-4">
            {suggestedFriends.map((suggestion) => (
              <div key={suggestion.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <h3 className="font-medium">{suggestion.username}</h3>
                      <p className="text-sm text-gray-500">Based on mutual friends</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Add</button>
                    <button className="p-2 text-gray-400">×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default FriendsPage;
