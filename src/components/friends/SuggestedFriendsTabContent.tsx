
import React from 'react';
import { UserProfile } from '@/types';
import { Card } from '@/components/ui/card';
import { Users, Calendar, Star, X, UserPlus } from 'lucide-react';
import { SkeletonCardList } from '@/components/skeletons/SkeletonCardList';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SuggestedFriend extends UserProfile {
  sharedEventId: string;
  sharedEventTitle: string;
  sharedEventDate: string;
  connectionReason: string;
}

interface SuggestedFriendsTabContentProps {
  suggestedFriends: SuggestedFriend[];
  loading: boolean;
  onAddFriend: (userId: string) => void;
  onDismiss: (userId: string) => void;
}

export const SuggestedFriendsTabContent: React.FC<SuggestedFriendsTabContentProps> = ({
  suggestedFriends,
  loading,
  onAddFriend,
  onDismiss
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Suggestions</h2>
        </div>
        <SkeletonCardList count={3} />
      </div>
    );
  }

  if (suggestedFriends.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Suggestions</h2>
        </div>
        
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions yet</h3>
          <p className="text-gray-600">
            Attend events to meet new people who share your interests. We'll suggest friends based on events you both attended.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Friend Suggestions Based on Events</h2>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-1">People You May Know</h3>
          <p className="text-sm text-gray-600">Based on events you've attended</p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestedFriends.map((friend) => (
          <Card key={friend.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={Array.isArray(friend.avatar_url) ? friend.avatar_url[0] || '' : friend.avatar_url || ''} 
                    alt={friend.username || ''} 
                  />
                  <AvatarFallback>
                    {friend.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{friend.username}</h3>
                    <span className="text-sm text-gray-500">1 mutual event</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>You both attended {friend.sharedEventTitle}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(friend.sharedEventDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddFriend(friend.id)}
                  className="flex items-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismiss(friend.id)}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {suggestedFriends.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="ghost" className="text-gray-600">
            See all suggestions
          </Button>
        </div>
      )}
    </div>
  );
};
