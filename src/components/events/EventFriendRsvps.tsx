
import React, { useState } from 'react';
import { UsersRound, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { navigateToUserProfile } from '@/utils/navigationUtils';

interface User {
  id: string;
  username?: string;
  avatar_url?: string[];
}

interface EventFriendRsvpsProps {
  going: User[];
  interested: User[];
  className?: string;
  isAuthenticated?: boolean;
}

export const EventFriendRsvps: React.FC<EventFriendRsvpsProps> = ({ 
  going = [], 
  interested = [],
  className = '',
  isAuthenticated = true
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isGoingDialogOpen, setIsGoingDialogOpen] = useState(false);
  const [isInterestedDialogOpen, setIsInterestedDialogOpen] = useState(false);
  
  // If not authenticated, don't show anything
  if (!isAuthenticated) {
    return null;
  }
  
  // Return null if no attendees
  if (going.length === 0 && interested.length === 0) {
    return null;
  }
  
  // Get display name for a user
  const getDisplayName = (user: User): string => {
    return user.username || 'Anonymous';
  };
  
  // Get avatar URL for a user (first one if multiple)
  const getAvatarUrl = (user: User): string | undefined => {
    if (user.avatar_url && Array.isArray(user.avatar_url) && user.avatar_url.length > 0) {
      return user.avatar_url[0];
    }
    return undefined;
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string): string => {
    return name.substring(0, 2).toUpperCase();
  };
  
  // Handle clicking on a user avatar/name
  const handleUserClick = (userId: string) => {
    navigateToUserProfile(userId, navigate);
  };
  
  const renderAttendeeAvatars = (users: User[], status: string) => {
    if (users.length === 0) return null;
    
    return (
      <div className="space-y-1.5">
        <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
          <UsersRound className="mr-1.5 h-4 w-4" /> 
          {status === 'going' ? 'Going' : 'Interested'} 
          <Badge variant="secondary" className="ml-2 text-xs py-0 px-2">
            {users.length}
          </Badge>
        </h4>
        
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-2 overflow-hidden">
            {users.slice(0, 5).map((user) => (
              <TooltipProvider key={user.id} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar 
                      className="h-8 w-8 border-2 border-white cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <AvatarImage src={getAvatarUrl(user)} alt={getDisplayName(user)} />
                      <AvatarFallback className="text-xs bg-gray-200">
                        {getInitials(getDisplayName(user))}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-white border border-gray-200 shadow-md z-50">
                    <p className="font-medium">{getDisplayName(user)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          {users.length > 5 && (
            <button 
              onClick={() => status === 'going' ? setIsGoingDialogOpen(true) : setIsInterestedDialogOpen(true)}
              className="h-8 flex items-center justify-center bg-gray-100 text-gray-700 text-xs font-medium rounded-full px-3 hover:bg-gray-200 transition-colors"
            >
              +{users.length - 5} more
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderAttendeesList = (users: User[], title: string) => {
    return (
      <div className="space-y-4 py-2">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleUserClick(user.id)}
          >
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={getAvatarUrl(user)} alt={getDisplayName(user)} />
              <AvatarFallback className="bg-gray-200">
                {getInitials(getDisplayName(user))}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{getDisplayName(user)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-md font-semibold mb-3">Friends Attending</h3>
      
      {renderAttendeeAvatars(going, 'going')}
      {renderAttendeeAvatars(interested, 'interested')}
      
      {/* Dialog for showing full list of users who are going */}
      <Dialog open={isGoingDialogOpen} onOpenChange={setIsGoingDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UsersRound className="mr-2 h-5 w-5" />
              Friends Going ({going.length})
            </DialogTitle>
          </DialogHeader>
          {renderAttendeesList(going, 'Going')}
        </DialogContent>
      </Dialog>
      
      {/* Dialog for showing full list of users who are interested */}
      <Dialog open={isInterestedDialogOpen} onOpenChange={setIsInterestedDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UsersRound className="mr-2 h-5 w-5" />
              Friends Interested ({interested.length})
            </DialogTitle>
          </DialogHeader>
          {renderAttendeesList(interested, 'Interested')}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventFriendRsvps;
