
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToUserProfile } from '@/utils/navigationUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/utils/string-utils';
import { UserPlus, UserMinus, UserCheck, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FriendCardProps {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  isFriend?: boolean;
  isPending?: boolean;
  isCurrentUser?: boolean;
  onAddFriend?: (userId: string) => void;
  onRemoveFriend?: (userId: string) => void;
  onCancelRequest?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
  mutualFriends?: number;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  id,
  name,
  username,
  avatarUrl,
  bio,
  isFriend = false,
  isPending = false,
  isCurrentUser = false,
  onAddFriend,
  onRemoveFriend,
  onCancelRequest,
  onMessage,
  className = '',
  showActions = true,
  compact = false,
  mutualFriends = 0
}) => {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigateToUserProfile(navigate, id);
  };
  
  const handleAddFriend = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddFriend) onAddFriend(id);
  };
  
  const handleRemoveFriend = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveFriend) onRemoveFriend(id);
  };
  
  const handleCancelRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCancelRequest) onCancelRequest(id);
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMessage) onMessage(id);
  };
  
  return (
    <Card 
      className={cn(
        "border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        compact ? "p-2" : "p-4",
        className
      )}
      onClick={handleProfileClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3">
          <Avatar className={cn(compact ? "h-10 w-10" : "h-12 w-12")}>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-medium text-gray-900 truncate",
                compact ? "text-sm" : "text-base"
              )}>
                {name}
              </h3>
              
              {isCurrentUser && (
                <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                  You
                </Badge>
              )}
            </div>
            
            <p className={cn(
              "text-gray-500 truncate",
              compact ? "text-xs" : "text-sm"
            )}>
              @{username}
            </p>
            
            {mutualFriends > 0 && (
              <p className="text-xs text-purple-600 mt-1">
                {mutualFriends} mutual {mutualFriends === 1 ? 'friend' : 'friends'}
              </p>
            )}
          </div>
          
          {showActions && !isCurrentUser && (
            <div className="flex items-center gap-2">
              {isFriend ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleMessage}
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                    onClick={handleRemoveFriend}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </>
              ) : isPending ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleCancelRequest}
                >
                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                  Pending
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleAddFriend}
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1" />
                  Add Friend
                </Button>
              )}
            </div>
          )}
        </div>
        
        {bio && !compact && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{bio}</p>
        )}
      </CardContent>
    </Card>
  );
};

// Add default export as well for backward compatibility
export default FriendCard;
