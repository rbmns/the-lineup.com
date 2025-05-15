
import React, { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader } from 'lucide-react';

interface FriendSearchProps {
  onSearch?: (query: string) => void;
  isSearching?: boolean;
  query?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
}

export const FriendSearch: React.FC<FriendSearchProps> = ({
  onSearch,
  isSearching = false,
  query = '',
  onQueryChange,
  placeholder = 'Find people by username...'
}) => {
  const [searchQuery, setSearchQuery] = useState(query);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    
    // If onQueryChange is provided, call it
    if (onQueryChange) {
      onQueryChange(newQuery);
    }
    
    // Legacy behavior for backward compatibility
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {isSearching ? (
          <Loader className="h-5 w-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query || searchQuery}
        onChange={handleChange}
        className="pl-10 py-2 w-full"
        disabled={isSearching}
      />
    </div>
  );
};
