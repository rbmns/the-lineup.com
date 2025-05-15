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

  // Check if the profile is clickable based on friendship status
  const isClickable = linkToProfile && isProfileClickable(friendStatus, false);

  const handleProfileClick = () => {
    // Only navigate if linkToProfile is true and profile is clickable based on friendship status
    if (isClickable) {
      console.log(`ProfileCard: Attempting to navigate to profile ${profile.id}`);
      console.log(`ProfileCard: Current friendship status: ${friendStatus}`);
      
      navigateToUserProfile(profile.id, navigate, friendStatus, false);
    } else {
      console.log(`ProfileCard: Profile is not clickable with status ${friendStatus}`);
    }
  };

  const handleAddFriendClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onAddFriend) onAddFriend();
  };

  const statusColors = {
    Online: 'bg-green-500',
    Away: 'bg-yellow-500',
    Offline: 'bg-gray-400'
  };

  // Determine the display elements based on friendship status
  const renderFriendshipButton = () => {
    if (!showActions) return null;
    
    switch (friendStatus) {
      case 'accepted':
        return (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1 text-purple-600" />
            <span>Friends</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-sm text-gray-500">
            <Check className="h-4 w-4 mr-1 text-gray-400" />
            <span>Request sent</span>
          </div>
        );
      default: // 'none'
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

  const cardClasses = `
    ${isCompact ? 'p-3' : 'p-4'}
    ${isClickable ? 'cursor-pointer hover:bg-gray-50' : ''}
    transition-colors duration-200
  `;

  return (
    <Card 
      className={`overflow-hidden ${isClickable ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={isClickable ? handleProfileClick : undefined}
    >
      <CardContent className={cardClasses}>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <ProfileAvatar profile={profile} />
            {profile.status && (
              <div 
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${statusColors[profile.status] || 'bg-gray-400'}`}
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${isClickable ? 'text-purple-700 hover:underline' : 'text-gray-900'}`}>
              {profile.username || 'Anonymous User'}
            </h3>
            
            {profile.tagline && !isCompact && (
              <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{profile.tagline}</p>
            )}
            
            {profile.location && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
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
