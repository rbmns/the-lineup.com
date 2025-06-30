
import React from 'react';
import { UserProfile } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ProfileAvatar } from './ProfileAvatar';
import { Button } from '@/components/ui/button';
import { MapPin, UserPlus, Users, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { isProfileClickable } from '@/utils/friendshipUtils';
import { navigateToUserProfile } from '@/utils/navigationUtils';

interface ProfileCardProps {
  profile: UserProfile;
  friendStatus?: 'none' | 'pending' | 'accepted';
  onAddFriend?: () => void;
  onAcceptRequest?: () => void;
  onDeclineRequest?: () => void;
  showActions?: boolean;
  isCompact?: boolean;
  linkToProfile?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  friendStatus = 'none',
  onAddFriend,
  onAcceptRequest,
  onDeclineRequest,
  showActions = true,
  isCompact = false,
  linkToProfile = true
}) => {
  const navigate = useNavigate();
  
  if (!profile) return null;

  const isClickable = linkToProfile && isProfileClickable(friendStatus, false);

  const handleProfileClick = () => {
    if (isClickable) {
      console.log(`ProfileCard: Attempting to navigate to profile ${profile.id}`);
      console.log(`ProfileCard: Current friendship status: ${friendStatus}`);
      
      navigateToUserProfile(profile.id, navigate);
    } else {
      console.log(`ProfileCard: Profile is not clickable with status ${friendStatus}`);
    }
  };

  const handleAddFriendClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddFriend) onAddFriend();
  };

  const statusColors = {
    Online: 'bg-green-500',
    Away: 'bg-yellow-500',
    Offline: 'bg-gray-400'
  };

  const renderFriendshipButton = () => {
    if (!showActions) return null;
    
    switch (friendStatus) {
      case 'accepted':
        return (
          <div className="flex items-center text-small text-graphite-grey font-lato">
            <Users className="h-4 w-4 mr-1 text-ocean-teal" />
            <span>Friends</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-small text-graphite-grey font-lato opacity-75">
            <Check className="h-4 w-4 mr-1" />
            <span>Request sent</span>
          </div>
        );
      default:
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleAddFriendClick}
            className="flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add Friend
          </Button>
        );
    }
  };

  return (
    <Card 
      className={`card-base transition-smooth ${isClickable ? 'cursor-pointer hover-lift' : ''}`}
      onClick={isClickable ? handleProfileClick : undefined}
    >
      <CardContent className={`${isCompact ? 'p-3' : 'p-4'}`}>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <ProfileAvatar profile={profile} />
            {profile.status && (
              <div 
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-pure-white ${statusColors[profile.status] || 'bg-mist-grey'}`}
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-h4 font-montserrat ${isClickable ? 'text-ocean-teal hover:underline' : 'text-graphite-grey'}`}>
              {profile.username || 'Anonymous User'}
            </h3>
            
            {profile.tagline && !isCompact && (
              <p className="text-small text-graphite-grey font-lato line-clamp-1 mt-1 opacity-75">{profile.tagline}</p>
            )}
            
            {profile.location && (
              <div className="flex items-center text-small text-graphite-grey font-lato mt-1 opacity-75">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{profile.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0">
            {renderFriendshipButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
