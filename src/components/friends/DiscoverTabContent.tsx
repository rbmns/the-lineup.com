
import React from 'react';
import { UserProfile } from '@/types';
import { FriendSearchBar } from './FriendSearchBar';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Find Friends</h2>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <FriendSearchBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              placeholder="Search friends by name or location..."
            />
          </div>
          <Button 
            onClick={() => document.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }))}
            disabled={isSearching || !searchQuery.trim()}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
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
              profile={profile}
              relationship="none"
              onAddFriend={() => onAddFriend(profile.id)}
              actionLabel="Send Request"
              pendingRequestIds={pendingRequestIds}
            />
          ))}
        </div>
      )}
    </>
  );
};
