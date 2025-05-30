
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
  const activityOptions = ['Active 2 hours ago', 'Active 1 day ago', 'Active 3 days ago', 'Active Just now', 'Active 5 hours ago', 'Active 1 week ago'];
  const activity = activityOptions[Math.floor(Math.random() * activityOptions.length)];

  return (
    <Card className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="text-center space-y-4">
        {/* Online Status Indicator */}
        <div className="relative inline-block">
          <ProfileAvatar profile={friend} size="lg" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Friend Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 text-lg">
            {friend.username || 'Anonymous User'}
          </h3>
          <p className="text-sm text-gray-500">
            {mutualFriendsCount} mutual friends
          </p>
          <p className="text-xs text-gray-400">
            {activity}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 mr-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            View Profile
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
