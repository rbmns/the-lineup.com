
import React from 'react';
import { UserProfile } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';

interface FriendGridCardProps {
  friend: UserProfile;
}

export const FriendGridCard = ({ friend }: FriendGridCardProps) => {
  // Mock data for mutual friends and activity - replace with real data
  const mutualFriendsCount = Math.floor(Math.random() * 10) + 1;
  const activityOptions = [
    'Active 2 hours ago', 
    'Active 1 day ago', 
    'Active 3 days ago', 
    'Active Just now', 
    'Active 5 hours ago', 
    'Active 1 week ago'
  ];
  const activity = activityOptions[Math.floor(Math.random() * activityOptions.length)];

  return (
    <Card className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="text-center space-y-4">
        {/* Avatar with Online Status */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mx-auto">
            <ProfileAvatar profile={friend} size="xl" className="w-full h-full" />
          </div>
          {/* Green online indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
        </div>

        {/* Friend Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {friend.username || 'Anonymous User'}
          </h3>
          <p className="text-sm text-gray-500">
            {mutualFriendsCount} mutual friends
          </p>
          <p className="text-xs text-gray-400">
            {activity}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            View Profile
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-9 h-9 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
