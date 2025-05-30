
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';

interface FriendRequest {
  id: string;
  profile: {
    id: string;
    username: string | null;
    avatar_url: string[] | null;
    email: string | null;
    location: string | null;
    tagline: string | null;
  };
}

interface FriendRequestsSectionProps {
  requests: FriendRequest[];
  onAccept: (requestId: string) => Promise<boolean>;
  onDecline: (requestId: string) => Promise<boolean>;
  loading: boolean;
}

export const FriendRequestsSection: React.FC<FriendRequestsSectionProps> = ({
  requests,
  onAccept,
  onDecline,
  loading
}) => {
  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = (avatarUrl: string[] | null) => {
    if (avatarUrl && Array.isArray(avatarUrl) && avatarUrl.length > 0) {
      return avatarUrl[0];
    }
    return null;
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Friend Requests ({requests.length})
      </h2>
      
      <div className="space-y-3">
        {requests.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getAvatarUrl(request.profile.avatar_url) || undefined} />
                  <AvatarFallback>{getInitials(request.profile.username)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium text-gray-900">
                    {request.profile.username || 'Unknown User'}
                  </h3>
                  {request.profile.location && (
                    <p className="text-sm text-gray-500">{request.profile.location}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onAccept(request.id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDecline(request.id)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
