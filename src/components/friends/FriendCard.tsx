
import React from 'react';
import { UserProfile } from '@/types/index';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { StatusBadgeRenderer } from './StatusBadgeRenderer';
import { navigateToUserProfile } from '@/utils/navigationUtils';

interface FriendCardProps {
  friend: UserProfile;
}

export const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  const navigate = useNavigate();

  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = () => {
    if (friend.avatar_url && Array.isArray(friend.avatar_url) && friend.avatar_url.length > 0) {
      return friend.avatar_url[0];
    }
    return null;
  };

  const handleCardClick = () => {
    navigateToUserProfile(friend.id, navigate);
  };

  return (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={getAvatarUrl() || undefined} />
          <AvatarFallback>{getInitials(friend.username)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate hover:text-purple-700">
              {friend.username || 'Unknown User'}
            </h3>
            <StatusBadgeRenderer status={friend.status} />
          </div>
          
          {friend.location && (
            <p className="text-sm text-gray-500 truncate">{friend.location}</p>
          )}
          
          {friend.tagline && (
            <p className="text-sm text-gray-600 truncate mt-1">{friend.tagline}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
