
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFriendData } from '@/hooks/useFriendData';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { FriendsTabs } from '@/components/friends/FriendsTabs';
import { UserProfile } from '@/types';

const Friends: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');

  // Fetch friend data including current friends list
  const { 
    friends,
    requests: friendRequests,
    loading: friendsLoading,
    refreshFriendsData
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
              friends={friends as UserProfile[]}
              loading={friendsLoading}
              requests={requests || []}
              onAcceptRequest={onAcceptRequest}
              onDeclineRequest={onDeclineRequest}
              showFriendRequests={true}
            />
          }
          discoverContent={
            <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Discover new people coming soon!</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Friends;
