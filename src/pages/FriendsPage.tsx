
import React from 'react';
import { FriendsHeader } from '@/components/friends/FriendsHeader';
import { FriendsTabs } from '@/components/friends/FriendsTabs';

const FriendsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <FriendsHeader />
      <FriendsTabs />
    </div>
  );
};

export default FriendsPage;
