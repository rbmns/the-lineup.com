
import React from 'react';
import { UserProfile } from '@/types';
import { FriendCard } from './FriendCard';

interface FriendsListProps {
  friends: UserProfile[];
  loading?: boolean;
}

export function FriendsList({ friends, loading }: FriendsListProps) {
  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500 font-inter leading-7">Loading your friends...</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500 font-inter leading-7">You don't have any friends yet.</p>
      </div>
    );
  }

  // Only accepted friends should be displayed here
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {friends.map((friend) => (
        <div key={friend.id} className="h-full">
          <FriendCard 
            profile={friend}
            showStatus={true}
            linkToProfile={true}
            friendshipStatus="accepted"
          />
        </div>
      ))}
    </div>
  );
};
