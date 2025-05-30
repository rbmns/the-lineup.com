
import React from 'react';
import { UserProfile } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, X } from 'lucide-react';
import { StatusBadgeRenderer } from './StatusBadgeRenderer';
import { EventBasedSuggestions } from './EventBasedSuggestions';

interface SuggestedFriendsTabContentProps {
  suggestedFriends: UserProfile[];
  loading: boolean;
  onAddFriend: (friendId: string) => Promise<void>;
  onDismiss: (friendId: string) => void;
  currentUserId?: string;
  friendIds?: string[];
}

export const SuggestedFriendsTabContent: React.FC<SuggestedFriendsTabContentProps> = ({
  suggestedFriends,
  loading,
  onAddFriend,
  onDismiss,
  currentUserId,
  friendIds = []
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

  const handleEventBasedAddFriend = async (friendId: string) => {
    await onAddFriend(friendId);
  };

  const handleEventBasedDismiss = (friendId: string) => {
    onDismiss(friendId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event-based suggestions */}
      <EventBasedSuggestions 
        currentUserId={currentUserId}
        friendIds={friendIds}
        onAddFriend={handleEventBasedAddFriend}
        onDismiss={handleEventBasedDismiss}
      />

      {/* Regular suggested friends */}
      {suggestedFriends.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Other Suggestions ({suggestedFriends.length})
          </h2>
          
          <div className="space-y-4">
            {suggestedFriends.map((friend) => (
              <Card key={friend.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getAvatarUrl(friend.avatar_url) || undefined} />
                      <AvatarFallback>{getInitials(friend.username)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
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
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onAddFriend(friend.id)}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDismiss(friend.id)}
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
      )}

      {suggestedFriends.length === 0 && !loading && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No additional suggestions</h3>
          <p className="text-gray-600">Check the event-based suggestions above or check back later.</p>
        </div>
      )}
    </div>
  );
};
