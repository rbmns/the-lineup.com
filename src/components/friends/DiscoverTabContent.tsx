
import React from 'react';
import { UserProfile } from '@/types';
import { FriendSearchBar } from './FriendSearchBar';
import { FriendSearch } from './FriendSearch';
import { FriendCard } from '@/components/profile/FriendCard';

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
        query={searchQuery}
        onQueryChange={(query: string) => {
          if (onSearchChange) {
            onSearchChange({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        isSearching={isSearching}
      />
      
      {/* Display search results separately */}
      {searchResults.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults.map(profile => (
            <FriendCard
              key={profile.id}
              profile={profile}
              relationship="none"
              onAddFriend={onAddFriend}
              actionLabel="Send Request"
            />
          ))}
        </div>
      )}
    </>
  );
};
