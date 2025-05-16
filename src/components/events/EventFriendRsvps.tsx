import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToUserProfile } from '@/utils/navigationUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/utils/stringUtils';
import { Users } from 'lucide-react';

interface Friend {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

interface EventFriendRsvpsProps {
  friends: Friend[];
  isLoading?: boolean;
  title?: string;
  emptyMessage?: string;
  maxDisplay?: number;
  showViewAllButton?: boolean;
  onViewAllClick?: () => void;
}

const EventFriendRsvps: React.FC<EventFriendRsvpsProps> = ({
  friends,
  isLoading = false,
  title = "Friends attending",
  emptyMessage = "None of your friends are attending yet",
  maxDisplay = 5,
  showViewAllButton = false,
  onViewAllClick
}) => {
  const navigate = useNavigate();
  
  // Handle profile navigation
  const handleProfileClick = (userId: string) => {
    navigateToUserProfile(navigate, userId);
  };
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Users className="h-4 w-4 mr-1.5" />
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // No friends attending
  if (!friends || friends.length === 0) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Users className="h-4 w-4 mr-1.5" />
          {title}
        </h3>
        <Card className="bg-gray-50 border-gray-100">
          <CardContent className="p-3 text-center text-sm text-gray-500">
            {emptyMessage}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Limit the number of friends displayed
  const displayFriends = friends.slice(0, maxDisplay);
  const hasMore = friends.length > maxDisplay;
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <Users className="h-4 w-4 mr-1.5" />
        {title} {friends.length > 0 && <span className="text-gray-500 ml-1">({friends.length})</span>}
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {displayFriends.map((friend) => (
          <Avatar 
            key={friend.id}
            className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
            onClick={() => handleProfileClick(friend.id)}
          >
            <AvatarImage src={friend.avatar_url || ''} alt={friend.username} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(friend.full_name || friend.username)}
            </AvatarFallback>
          </Avatar>
        ))}
        
        {hasMore && !showViewAllButton && (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium">
            +{friends.length - maxDisplay}
          </div>
        )}
      </div>
      
      {showViewAllButton && hasMore && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2 text-xs h-7 px-2"
          onClick={onViewAllClick}
        >
          View all {friends.length} friends
        </Button>
      )}
    </div>
  );
};

export default EventFriendRsvps;
