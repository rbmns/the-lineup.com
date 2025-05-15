
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navigateToUserProfile } from '@/utils/navigationUtils';

interface FriendshipButtonProps {
  profileId: string;
  username?: string;
  isCurrentUser: boolean;
  isAccepted: boolean;
  isPending: boolean;
  userSentRequest: boolean;
  canNavigateToProfile: boolean;
  friendshipStatus: 'none' | 'pending' | 'accepted';
  isLoading: boolean;
  onAddFriend: (e: React.MouseEvent) => void;
  onAcceptRequest: (e: React.MouseEvent) => void;
  onDeclineRequest: (e: React.MouseEvent) => void;
  navigateToProfile: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

export const FriendshipButton: React.FC<FriendshipButtonProps> = ({
  profileId,
  isCurrentUser,
  isAccepted,
  isPending,
  userSentRequest,
  canNavigateToProfile,
  friendshipStatus,
  isLoading,
  onAddFriend,
  onAcceptRequest,
  onDeclineRequest,
  navigateToProfile
}) => {
  const navigate = useNavigate();
  
  if (isCurrentUser) {
    // Don't show any button for the current user
    return null;
  }
  
  if (isAccepted) {
    return (
      <Button
        onClick={navigateToProfile}
        size="sm"
        variant="outline"
        className="ml-2 whitespace-nowrap flex-shrink-0 font-inter z-10 border-purple-200 text-purple-700 hover:bg-purple-50"
        disabled={isLoading || !canNavigateToProfile}
      >
        Visit Profile
      </Button>
    );
  }
  
  if (isPending) {
    // Check if current user is the sender or recipient
    if (userSentRequest) {
      return (
        <span className="text-xs text-gray-500 ml-2 flex-shrink-0 font-inter py-1 px-2 bg-gray-100 rounded-full">
          Request Pending
        </span>
      );
    } else {
      // Current user received the request
      return (
        <div className="flex ml-2 space-x-1 z-10">
          <Button
            onClick={onAcceptRequest}
            size="sm"
            className="whitespace-nowrap flex-shrink-0 font-inter bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            <UserCheck className="h-3 w-3 mr-1" />
            Accept
          </Button>
          <Button
            onClick={onDeclineRequest}
            size="sm"
            variant="outline"
            className="whitespace-nowrap flex-shrink-0 font-inter border-gray-200"
            disabled={isLoading}
          >
            <X className="h-3 w-3 mr-1" />
            Decline
          </Button>
        </div>
      );
    }
  }
  
  return (
    <Button
      onClick={onAddFriend}
      size="sm"
      className="ml-2 whitespace-nowrap flex-shrink-0 font-inter z-10"
      disabled={isLoading}
    >
      Add Friend
    </Button>
  );
};
