
import React, { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader } from 'lucide-react';
import { UserProfile } from '@/types';

interface FriendSearchProps {
  onSearch?: (query: string) => void;
  isSearching?: boolean;
  query?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  searchQuery?: string; // Added for compatibility with DiscoverTabContent
  searchResults?: UserProfile[]; // Added for compatibility with DiscoverTabContent
  onAddFriend?: (id: string) => void; // Added for compatibility with DiscoverTabContent
  loading?: boolean; // Added for compatibility with DiscoverTabContent
  pendingRequestIds?: string[]; // Added for compatibility with DiscoverTabContent
}

export const FriendSearch: React.FC<FriendSearchProps> = ({
  onSearch,
  isSearching = false,
  query = '',
  onQueryChange,
  placeholder = 'Find people by username...',
  searchQuery, // Added
  searchResults, // Added
  onAddFriend, // Added
  loading, // Added
  pendingRequestIds = [] // Added
}) => {
  const [searchQueryState, setSearchQueryState] = useState(query || searchQuery || '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQueryState(newQuery);
    
    // If onQueryChange is provided, call it
    if (onQueryChange) {
      onQueryChange(newQuery);
    }
    
    // Legacy behavior for backward compatibility
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  // Determine if we should show loading state
  const isLoading = isSearching || loading;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {isLoading ? (
          <Loader className="h-5 w-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query || searchQuery || searchQueryState}
        onChange={handleChange}
        className="pl-10 py-2 w-full"
        disabled={isLoading}
      />
      
      {/* Render search results if they are provided */}
      {searchResults && searchResults.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rendering of search results would be placed here */}
          {/* This would typically call a FriendCard component for each result */}
        </div>
      )}
    </div>
  );
};
