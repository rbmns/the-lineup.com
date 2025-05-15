
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, UserPlus, Clock, UserMinus } from 'lucide-react';

interface FriendCardButtonsProps {
  profileId?: string;
  username?: string;
  isCurrentUser?: boolean;
  friendshipStatus?: 'none' | 'pending' | 'requested' | 'accepted';
  isLoading?: boolean;
  pendingRequestIds?: string[];
  onAddFriend?: (id: string) => void;
  onAcceptRequest?: (id: string) => Promise<void>;
  onDeclineRequest?: (id: string) => Promise<void>;
  onRemoveFriend?: (id: string) => void;
  // New props for direct actions
  relationship?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  actionLabel?: string;
  secondaryActionLabel?: string;
}

export const FriendCardButtons: React.FC<FriendCardButtonsProps> = ({
  profileId = '',
  username = '',
  isCurrentUser = false,
  friendshipStatus = 'none',
  isLoading = false,
  pendingRequestIds = [],
  onAddFriend,
  onAcceptRequest,
  onDeclineRequest,
  onRemoveFriend,
  // New props
  relationship,
  onAction,
  onSecondaryAction,
  actionLabel,
  secondaryActionLabel
}) => {
  if (isCurrentUser) {
    return null;
  }
  
  const isPending = pendingRequestIds.includes(profileId);

  // If direct action props are provided, use those instead of the standard friendship actions
  if (onAction && relationship) {
    if (relationship === 'received') {
      return (
        <div className="flex space-x-2">
          <Button 
            variant="default"
            size="sm" 
            onClick={onAction}
            disabled={isLoading}
            className="flex items-center"
          >
            <Check className="h-4 w-4 mr-1" />
            {actionLabel || 'Accept'}
          </Button>
          {onSecondaryAction && (
            <Button 
              variant="outline"
              size="sm"
              onClick={onSecondaryAction}
              disabled={isLoading}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              {secondaryActionLabel || 'Decline'}
            </Button>
          )}
        </div>
      );
    }

    if (relationship === 'sent') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          disabled={isLoading}
          className="flex items-center"
        >
          <Clock className="h-4 w-4 mr-1" />
          {actionLabel || 'Cancel'}
        </Button>
      );
    }

    if (relationship === 'friends' || relationship === 'accepted') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          disabled={isLoading}
          className="flex items-center"
        >
          <UserMinus className="h-4 w-4 mr-1" />
          {actionLabel || 'Remove'}
        </Button>
      );
    }

    // Default action button (for "none" relationship)
    return (
      <Button
        variant="default"
        size="sm"
        onClick={onAction}
        disabled={isLoading}
        className="flex items-center"
      >
        <UserPlus className="h-4 w-4 mr-1" />
        {actionLabel || 'Add Friend'}
      </Button>
    );
  }

  // Standard friendship buttons based on status
  if (friendshipStatus === 'pending') {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="flex items-center"
      >
        <Clock className="h-4 w-4 mr-1" />
        Pending
      </Button>
    );
  }

  if (friendshipStatus === 'requested') {
    return (
      <div className="flex space-x-2">
        <Button 
          variant="default"
          size="sm" 
          onClick={() => onAcceptRequest && onAcceptRequest(profileId)}
          disabled={isLoading}
          className="flex items-center"
        >
          <Check className="h-4 w-4 mr-1" />
          Accept
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => onDeclineRequest && onDeclineRequest(profileId)}
          disabled={isLoading}
          className="flex items-center"
        >
          <X className="h-4 w-4 mr-1" />
          Decline
        </Button>
      </div>
    );
  }

  if (friendshipStatus === 'accepted') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRemoveFriend && onRemoveFriend(profileId)}
        disabled={isLoading}
        className="flex items-center"
      >
        <UserMinus className="h-4 w-4 mr-1" />
        Remove
      </Button>
    );
  }

  // Default "Add Friend" button
  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => onAddFriend && onAddFriend(profileId)}
      disabled={isLoading || isPending}
      className="flex items-center"
    >
      <UserPlus className="h-4 w-4 mr-1" />
      {isPending ? 'Pending' : 'Add Friend'}
    </Button>
  );
};
