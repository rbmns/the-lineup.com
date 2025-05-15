
import React from 'react';
import { UserCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { navigateToUserProfile } from '@/utils/navigationUtils';

interface FriendCardButtonsProps {
  profileId: string;
  username: string;
  isCurrentUser: boolean;
  friendshipStatus: 'none' | 'pending' | 'accepted';
  isLoading: boolean;
  pendingRequestIds: string[];
  onAddFriend: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
}

export const FriendCardButtons: React.FC<FriendCardButtonsProps> = ({
  profileId,
  username,
  isCurrentUser,
  friendshipStatus,
  isLoading,
  pendingRequestIds,
  onAddFriend,
  onAcceptRequest,
  onDeclineRequest
}) => {
  const navigate = useNavigate();
  
  // Check if this profile is in the pending requests list
  const isPending = friendshipStatus === 'pending' || pendingRequestIds.includes(profileId);
  const isAccepted = friendshipStatus === 'accepted';
  
  // Determine if profile should be clickable for navigation
  const canNavigateToProfile = !isCurrentUser && (isAccepted || isCurrentUser);
  
  const handleNavigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!profileId || !canNavigateToProfile) return;
    navigateToUserProfile(profileId, navigate, friendshipStatus, isCurrentUser);
  };

  // Don't show any button for the current user
  if (isCurrentUser) {
    return null;
  }
  
  if (isAccepted) {
    return (
      <Button
        onClick={handleNavigateToProfile}
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
    const userSentRequest = pendingRequestIds.includes(profileId);
    
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
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault(); 
              onAcceptRequest(profileId); 
            }}
            size="sm"
            className="whitespace-nowrap flex-shrink-0 font-inter bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            <UserCheck className="h-3 w-3 mr-1" />
            Accept
          </Button>
          <Button
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault(); 
              onDeclineRequest(profileId); 
            }}
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
      onClick={(e) => { 
        e.stopPropagation(); 
        e.preventDefault(); 
        onAddFriend(profileId); 
      }}
      size="sm"
      className="ml-2 whitespace-nowrap flex-shrink-0 font-inter z-10"
      disabled={isLoading}
    >
      Add Friend
    </Button>
  );
};
