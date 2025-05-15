
import React from 'react';
import { UserProfile } from '@/types';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useFriendship } from '@/hooks/useFriendship';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { UserProfileWithFriendship } from '@/types/friends-extended';
import { useNavigate } from 'react-router-dom';
import { navigateToUserProfile } from '@/utils/navigationUtils';
import { isProfileClickable } from '@/utils/friendshipUtils';
import { MapPin } from 'lucide-react';
import { FriendCardButtons } from '@/components/friends/FriendCardButtons';
import { StatusBadgeRenderer } from '@/components/friends/StatusBadgeRenderer';

interface FriendCardProps {
  // Updated to accept either a profile object or individual properties
  profile?: UserProfile | UserProfileWithFriendship;
  // Individual properties for when called with separate props
  id?: string;
  username?: string;
  avatarUrl?: string;
  status?: string;
  showStatus?: boolean;
  linkToProfile?: boolean;
  friendshipStatus?: 'none' | 'pending' | 'accepted';
  relationship?: string;
  pendingRequestIds?: string[];
  onAddFriend?: (id: string) => void;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  actionLabel?: string;
  secondaryActionLabel?: string;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  profile,
  id,
  username,
  avatarUrl,
  status,
  showStatus = true,
  linkToProfile = true,
  friendshipStatus = 'none',
  relationship,
  pendingRequestIds = [],
  onAddFriend,
  onAction,
  onSecondaryAction,
  actionLabel,
  secondaryActionLabel
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { initiateFriendRequest, acceptFriendRequest, declineFriendRequest, isLoading } = useFriendship();
  const navigate = useNavigate();
  
  // Use either passed individual props or extract from profile object
  const profileId = id || profile?.id;
  const profileUsername = username || profile?.username || 'Anonymous User';
  const profileAvatarUrl = avatarUrl || profile?.avatar_url;
  const profileStatus = status || profile?.status;
  
  // Create a profile object for components that need it
  const profileObj = profile || {
    id: profileId,
    username: profileUsername,
    avatar_url: profileAvatarUrl,
    status: profileStatus
  };
  
  const isCurrentUser = user?.id === profileId;
  
  // Check if profile should be clickable
  const canNavigateToProfile = linkToProfile && isProfileClickable(friendshipStatus, isCurrentUser);
  
  // Improved navigation function using our utility
  const navigateToProfile = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!profileId || !canNavigateToProfile) return;
    
    // Stop propagation and prevent default to avoid any parent handling
    e.stopPropagation();
    e.preventDefault();
    
    console.log(`FriendCard: Navigating to profile: ${profileId} (at ${new Date().toISOString()})`);
    console.log("FriendCard: Event target:", e.target);
    console.log("FriendCard: Current URL:", window.location.href);
    
    navigateToUserProfile(profileId, navigate, friendshipStatus, isCurrentUser);
  };

  const handleAddFriend = (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add friends",
        variant: "destructive"
      });
      return;
    }

    if (onAddFriend) {
      // Use the prop function if available
      onAddFriend(id);
    } else {
      // Otherwise use the hook
      initiateFriendRequest(id)
        .then(success => {
          if (success) {
            toast({
              title: "Friend request sent",
              description: `Friend request sent to ${profileUsername}`,
              variant: "default"
            });
          }
        })
        .catch(error => {
          console.error('Error sending friend request:', error);
          toast({
            title: "Error",
            description: "Failed to send friend request",
            variant: "destructive"
          });
        });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && canNavigateToProfile) {
      navigateToProfile(e);
    }
  };
  
  // Handle actions passed via props
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (relationship === 'none' && profileId) {
      handleAddFriend(profileId);
    }
  };
  
  // Determine card styling based on clickability
  const cardCursorClass = canNavigateToProfile ? 
    'overflow-hidden transition-all duration-300 p-4 flex flex-col h-full border-gray-200 hover:shadow-md cursor-pointer active:translate-y-0.5' : 
    'overflow-hidden transition-all duration-300 p-4 flex flex-col h-full border-gray-200';

  return (
    <Card 
      className={cardCursorClass}
      onClick={canNavigateToProfile ? navigateToProfile : undefined}
      role={canNavigateToProfile ? "link" : undefined}
      aria-label={canNavigateToProfile ? `View ${profileUsername}'s profile` : undefined}
      tabIndex={canNavigateToProfile ? 0 : undefined}
      onKeyDown={canNavigateToProfile ? handleKeyDown : undefined}
      data-profile-id={profileId}
    >
      <div className="flex items-center justify-between flex-1">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex-shrink-0">
            <ProfileAvatar
              profile={profileObj}
              size={isMobile ? "sm" : "md"}
              className="shadow-md"
            />
          </div>

          <div className="flex-1 min-w-0 truncate">
            <div className="text-black transition-colors">
              <h3 className={`font-medium truncate ${canNavigateToProfile ? 'text-gray-800 font-inter hover:underline' : 'text-gray-800 font-inter'}`}>
                {profileUsername}
              </h3>
            </div>

            {/* Location info from profile */}
            {profile?.location && (
              <div className="flex items-center text-xs text-gray-600 truncate font-inter">
                <MapPin className="h-3 w-3 mr-1 text-purple flex-shrink-0" />
                <span className="truncate">{profile.location}</span>
              </div>
            )}

            {showStatus && profileStatus && (
              <div className="flex items-center mt-2">
                <StatusBadgeRenderer status={profileStatus} />
              </div>
            )}
          </div>
        </div>

        {/* Use either the relationship pattern with the FriendCardButtons component, or direct action buttons */}
        {profileId && relationship ? (
          <FriendCardButtons
            profileId={profileId}
            username={profileUsername}
            isCurrentUser={isCurrentUser}
            friendshipStatus={friendshipStatus}
            isLoading={isLoading} 
            pendingRequestIds={pendingRequestIds}
            onAddFriend={handleAddFriend}
            onAcceptRequest={acceptFriendRequest}
            onDeclineRequest={declineFriendRequest}
            relationship={relationship}
            onAction={onAction}
            onSecondaryAction={onSecondaryAction}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
          />
        ) : null}
      </div>
    </Card>
  );
};
