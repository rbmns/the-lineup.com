
import React, { useEffect } from 'react';
import { UserProfile } from '@/types/index';
import { FriendsList } from './FriendsList';
import { FriendRequestsSection } from './FriendRequestsSection';
import { FriendSearchBar } from './FriendSearchBar';

interface FriendsTabContentProps {
  friends: UserProfile[];
  loading: boolean;
  requests: Array<{ id: string; profile: any }>;
  onAcceptRequest: (requestId: string) => Promise<boolean>;
  onDeclineRequest: (requestId: string) => Promise<boolean>;
  showFriendRequests: boolean;
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FriendsTabContent = ({
  friends,
  loading,
  requests,
  onAcceptRequest,
  onDeclineRequest,
  showFriendRequests,
  searchQuery = '',
  onSearchChange
}: FriendsTabContentProps) => {
  const hasPendingRequests = requests && requests.length > 0;
  
  return (
    <div className="section-content">
      {/* Search bar for filtering friends */}
      {onSearchChange && (
        <div className="mb-6">
          <FriendSearchBar 
            searchQuery={searchQuery} 
            onSearchChange={onSearchChange} 
          />
        </div>
      )}
      
      {hasPendingRequests && showFriendRequests && (
        <div className="mb-8">
          <FriendRequestsSection
            requests={requests}
            onAccept={async (requestId) => {
              const success = await onAcceptRequest(requestId);
              return success;
            }}
            onDecline={onDeclineRequest}
            loading={loading}
          />
        </div>
      )}
      
      <div>
        <h2 className="text-h2 font-montserrat text-graphite-grey mb-6">
          My Friends ({friends?.length || 0})
        </h2>
        <FriendsList 
          friends={friends || []} 
          loading={loading}
        />
      </div>
    </div>
  );
};
