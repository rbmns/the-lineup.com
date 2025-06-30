
import React from 'react';
import { UserProfile } from '@/types/index';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { StatusBadgeRenderer } from './StatusBadgeRenderer';
import { navigateToUserProfile } from '@/utils/navigationUtils';
import { MapPin } from 'lucide-react';

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
    <Card className="card-base cursor-pointer hover-lift transition-smooth" onClick={handleCardClick}>
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={getAvatarUrl() || undefined} />
          <AvatarFallback className="bg-mist-grey text-graphite-grey font-montserrat">{getInitials(friend.username)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-h4 font-montserrat text-graphite-grey truncate hover:text-ocean-teal transition-colors">
              {friend.username || 'Unknown User'}
            </h3>
            <StatusBadgeRenderer status={friend.status} />
          </div>
          
          {friend.location && (
            <div className="flex items-center text-small text-graphite-grey font-lato opacity-75 truncate mb-1">
              <MapPin className="h-3 w-3 mr-1 text-ocean-teal flex-shrink-0" />
              <span className="truncate">{friend.location}</span>
            </div>
          )}
          
          {friend.tagline && (
            <p className="text-small text-graphite-grey font-lato opacity-75 truncate">{friend.tagline}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
