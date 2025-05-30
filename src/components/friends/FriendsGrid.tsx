
import React from 'react';
import { UserProfile } from '@/types';
import { FriendGridCard } from './FriendGridCard';

interface FriendsGridProps {
  friends: UserProfile[];
  loading: boolean;
}

export const FriendsGrid = ({ friends, loading }: FriendsGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
              <div className="space-y-2 text-center">
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded flex-1"></div>
                <div className="h-9 w-9 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-500 text-lg mb-2">No friends yet</div>
        <div className="text-gray-400 text-sm">Start connecting with people to build your network</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {friends.map((friend) => (
        <FriendGridCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
};
