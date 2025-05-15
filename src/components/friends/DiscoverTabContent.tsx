
import React from 'react';
import { UserProfile } from '@/types';
import { FriendSearchBar } from './FriendSearchBar';
import { FriendSearch } from './FriendSearch';

interface DiscoverTabContentProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResults: UserProfile[];
  onAddFriend: (id: string) => void;
  isSearching: boolean;
  pendingRequestIds: string[];
}

export const DiscoverTabContent = ({
  searchQuery,
  onSearchChange,
  searchResults,
  onAddFriend,
  isSearching,
  pendingRequestIds
}: DiscoverTabContentProps) => {
  return (
    <>
      <div className="mb-4">
        <FriendSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>
      
      <FriendSearch
        searchQuery={searchQuery}
        searchResults={searchResults}
        onAddFriend={onAddFriend}
        loading={isSearching}
        pendingRequestIds={pendingRequestIds}
      />
    </>
  );
};
