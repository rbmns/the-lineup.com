
import React, { useEffect } from 'react';
import { UserProfile } from '@/types';
import { FriendsList } from './FriendsList';
import { FriendRequestsSection } from './FriendRequestsSection';

interface FriendsTabContentProps {
  friends: UserProfile[];
  loading: boolean;
  requests: Array<{ id: string; profile: any }>;
  onAcceptRequest: (requestId: string) => Promise<boolean>;
  onDeclineRequest: (requestId: string) => Promise<boolean>;
  showFriendRequests: boolean;
}

export const FriendsTabContent = ({
  friends,
  loading,
  requests,
  onAcceptRequest,
  onDeclineRequest,
  showFriendRequests
}: FriendsTabContentProps) => {
  // Only show friend requests section if there are pending requests
  const hasPendingRequests = requests && requests.length > 0;
  
  return (
    <>
      {hasPendingRequests && showFriendRequests && (
        <div className="mb-8">
          <FriendRequestsSection
            requests={requests}
            onAccept={async (requestId) => {
              const success = await onAcceptRequest(requestId);
              // Refresh is not needed here since we handle the state update in the parent component
              return success;
            }}
            onDecline={onDeclineRequest}
            loading={loading}
          />
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          My Friends ({friends?.length || 0})
        </h2>
        <FriendsList 
          friends={friends || []} 
          loading={loading}
        />
      </div>
    </>
  );
};
