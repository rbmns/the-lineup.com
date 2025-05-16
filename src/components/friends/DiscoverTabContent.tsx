
import React, { useEffect } from 'react';
import { UserProfile } from '@/types';
import { FriendSearchBar } from './FriendSearchBar';
import FriendCard from '@/components/profile/FriendCard';

interface DiscoverTabContentProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResults: UserProfile[];
  onAddFriend: (id: string) => void;
  isSearching: boolean;
  pendingRequestIds: string[]; // This is correct as an array
  onSearch: () => void;
}

export const DiscoverTabContent = ({
  searchQuery,
  onSearchChange,
  searchResults,
  onAddFriend,
  isSearching,
  pendingRequestIds,
  onSearch
}: DiscoverTabContentProps) => {
  // Trigger search when typing
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      onSearch();
    }
  }, [searchQuery, onSearch]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Find Friends</h2>
        <div className="w-full">
          <FriendSearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            placeholder="Search friends by name or location..."
          />
        </div>
      </div>
      
      {/* Show loading state */}
      {isSearching && (
        <div className="min-h-[200px] flex items-center justify-center">
          <p className="text-gray-500">Searching for users...</p>
        </div>
      )}
      
      {/* Empty search state */}
      {!isSearching && searchQuery && searchResults.length === 0 && (
        <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      )}
      
      {/* Default empty state */}
      {!isSearching && !searchQuery && (
        <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Search for friends by name or location</p>
        </div>
      )}
      
      {/* Display search results */}
      {!isSearching && searchResults.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults.map(profile => (
            <FriendCard
              key={profile.id}
              id={profile.id}
              name={profile.username || ''}
              username={profile.username || ''}
              avatarUrl={profile.avatar_url && profile.avatar_url.length > 0 ? profile.avatar_url[0] : null}
              onAddFriend={() => onAddFriend(profile.id)}
              isPending={pendingRequestIds.includes(profile.id)}
              pendingFriendIds={pendingRequestIds}
            />
          ))}
        </div>
      )}
    </>
  );
};
