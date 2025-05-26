
import React from 'react';
import { UserProfile } from '@/types';
import { FriendCard } from '@/components/profile/FriendCard';
import { Card } from '@/components/ui/card';
import { Users, Calendar } from 'lucide-react';
import { SkeletonCardList } from '@/components/skeletons/SkeletonCardList';

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
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Suggested Friends</h2>
        </div>
        <SkeletonCardList count={3} />
      </div>
    );
  }

  if (suggestedFriends.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Suggested Friends</h2>
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">
          Suggested Friends ({suggestedFriends.length})
        </h2>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        People you met at events who might become great connections
      </div>

      <div className="grid gap-4">
        {suggestedFriends.map((friend) => (
          <Card key={friend.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <FriendCard
                  profile={friend}
                  linkToProfile={true}
                  showStatus={false}
                  relationship="suggested"
                  onAction={() => onAddFriend(friend.id)}
                  onSecondaryAction={() => onDismiss(friend.id)}
                  actionLabel="Add Friend"
                  secondaryActionLabel="Not Now"
                />
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{friend.connectionReason}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(friend.sharedEventDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
