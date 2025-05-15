
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FriendRequest } from '@/types/friends';

interface FriendRequestsProps {
  requests: { id: string; profile: any }[];
  loading: boolean;
  handleAcceptRequest?: (requestId: string) => Promise<boolean>;
  handleDeclineRequest?: (requestId: string) => Promise<boolean>;
  processingId?: string | null;
}

export const FriendRequests: React.FC<FriendRequestsProps> = ({ 
  requests = [], 
  loading = false,
  handleAcceptRequest,
  handleDeclineRequest,
  processingId = null
}) => {
  // Early return for loading state
  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  // Early return for empty state
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No friend requests at this time.
      </div>
    );
  }
  
  const handleAccept = async (requestId: string) => {
    if (!handleAcceptRequest) return;
    
    try {
      const success = await handleAcceptRequest(requestId);
      if (success) {
        // Toast message handled in the hook
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  
  const handleDecline = async (requestId: string) => {
    if (!handleDeclineRequest) return;
    
    try {
      const success = await handleDeclineRequest(requestId);
      if (success) {
        // Toast message handled in the hook
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };
  
  return (
    <div className="space-y-2">
      {requests.map((request) => {
        const profile = request.profile || {};
        const isProcessing = processingId === request.id;
        
        return (
          <div 
            key={request.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
          >
            <Link 
              to={`/users/${profile.id}`} 
              className="flex items-center gap-2"
            >
              <ProfileAvatar profile={profile} size="sm" />
              <div>
                <p className="font-medium">{profile.username}</p>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
            </Link>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecline(request.id)}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Decline'}
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleAccept(request.id)}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Accept'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
