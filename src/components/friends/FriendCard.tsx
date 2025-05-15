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
import { isProfileClickable } from '@/utils/friendshipUtils';
import { FriendshipButton } from './FriendshipButton';
import { ProfileInfo } from './ProfileInfo';

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
  
  // Check if this profile is in the pending requests list
  const isPending = friendshipStatus === 'pending' || pendingRequestIds.includes(profile.id);
  const isAccepted = friendshipStatus === 'accepted';
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
    console.log("FriendCard: Current URL:", window.location.href);
    
    navigate(`/users/${profile.id}`, { 
      state: { 
        fromDirectNavigation: true,
        timestamp: Date.now() 
      }
    });
    
    // Set a flag in sessionStorage to track navigation
    sessionStorage.setItem('lastProfileNavigation', JSON.stringify({
      userId: profile.id,
      timestamp: Date.now(),
      fromDirectNavigation: true
    }));
  };

  const handleAddFriend = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent any parent navigation
    
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
      onAddFriend(profile.id);
    } else {
      // Otherwise use the hook
      initiateFriendRequest(profile.id)
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
  
  const handleRespondToRequest = (accept: boolean) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) return;
    
    if (accept) {
      acceptFriendRequest(profile.id)
        .then(success => {
          if (success) {
            toast({
              title: "Friend request accepted",
              description: `You are now friends with ${profile.username}`,
              variant: "default"
            });
          }
        });
    } else {
      declineFriendRequest(profile.id)
        .then(success => {
          if (success) {
            toast({
              title: "Friend request declined",
              description: `You declined ${profile.username}'s friend request`,
              variant: "default"
            });
          }
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

  // Check if the current user sent the friend request
  const userSentRequest = pendingRequestIds.includes(profile.id);

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

          <ProfileInfo 
            username={profile.username || ''}
            location={profile.location}
            status={profile.status || undefined}
            showStatus={showStatus}
            canNavigateToProfile={canNavigateToProfile}
          />
        </div>

        <FriendshipButton
          profileId={profile.id}
          username={profile.username}
          isCurrentUser={isCurrentUser}
          isAccepted={isAccepted}
          isPending={isPending}
          userSentRequest={userSentRequest}
          canNavigateToProfile={canNavigateToProfile}
          friendshipStatus={friendshipStatus}
          isLoading={isLoading}
          onAddFriend={handleAddFriend}
          onAcceptRequest={handleRespondToRequest(true)}
          onDeclineRequest={handleRespondToRequest(false)}
          navigateToProfile={navigateToProfile}
        />
      </div>
    </Card>
  );
};
