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
  profile: UserProfile | UserProfileWithFriendship;
  showStatus?: boolean;
  linkToProfile?: boolean;
  friendshipStatus?: 'none' | 'pending' | 'accepted';
  pendingRequestIds?: string[];
  onAddFriend?: (id: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  profile,
  showStatus = true,
  linkToProfile = true,
  friendshipStatus = 'none',
  pendingRequestIds = [],
  onAddFriend
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { initiateFriendRequest, acceptFriendRequest, declineFriendRequest, isLoading } = useFriendship();
  const navigate = useNavigate();
  
  const isCurrentUser = user?.id === profile.id;
  
  // Check if profile should be clickable
  const canNavigateToProfile = linkToProfile && isProfileClickable(friendshipStatus, isCurrentUser);
  
  // Improved navigation function using our utility
  const navigateToProfile = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!profile.id || !canNavigateToProfile) return;
    
    // Stop propagation and prevent default to avoid any parent handling
    e.stopPropagation();
    e.preventDefault();
    
    console.log(`FriendCard: Navigating to profile: ${profile.id} (at ${new Date().toISOString()})`);
    console.log("FriendCard: Event target:", e.target);
    console.log("FriendCard: Current URL:", window.location.href);
    
    navigateToUserProfile(profile.id, navigate, friendshipStatus, isCurrentUser);
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
              description: `Friend request sent to ${profile.username}`,
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
  
  // Determine card styling based on clickability
  const cardCursorClass = canNavigateToProfile ? 
    'overflow-hidden transition-all duration-300 p-4 flex flex-col h-full border-gray-200 hover:shadow-md cursor-pointer active:translate-y-0.5' : 
    'overflow-hidden transition-all duration-300 p-4 flex flex-col h-full border-gray-200';

  return (
    <Card 
      className={cardCursorClass}
      onClick={canNavigateToProfile ? navigateToProfile : undefined}
      role={canNavigateToProfile ? "link" : undefined}
      aria-label={canNavigateToProfile ? `View ${profile.username}'s profile` : undefined}
      tabIndex={canNavigateToProfile ? 0 : undefined}
      onKeyDown={canNavigateToProfile ? handleKeyDown : undefined}
      data-profile-id={profile.id}
    >
      <div className="flex items-center justify-between flex-1">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex-shrink-0">
            <ProfileAvatar
              profile={profile}
              size={isMobile ? "sm" : "md"}
              className="shadow-md"
            />
          </div>

          <div className="flex-1 min-w-0 truncate">
            <div className="text-black transition-colors">
              <h3 className={`font-medium truncate ${canNavigateToProfile ? 'text-gray-800 font-inter hover:underline' : 'text-gray-800 font-inter'}`}>
                {profile.username || 'Anonymous User'}
              </h3>
            </div>

            {profile.location && (
              <div className="flex items-center text-xs text-gray-600 truncate font-inter">
                <MapPin className="h-3 w-3 mr-1 text-purple flex-shrink-0" />
                <span className="truncate">{profile.location}</span>
              </div>
            )}

            {showStatus && profile.status && (
              <div className="flex items-center mt-2">
                <StatusBadgeRenderer status={profile.status} />
              </div>
            )}
          </div>
        </div>

        {/* Friendship action buttons */}
        <FriendCardButtons
          profileId={profile.id}
          username={profile.username || 'User'}
          isCurrentUser={isCurrentUser}
          friendshipStatus={friendshipStatus}
          isLoading={isLoading}
          pendingRequestIds={pendingRequestIds}
          onAddFriend={handleAddFriend}
          onAcceptRequest={acceptFriendRequest}
          onDeclineRequest={declineFriendRequest}
        />
      </div>
    </Card>
  );
};
