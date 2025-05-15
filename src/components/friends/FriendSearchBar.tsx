
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FriendSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FriendSearchBar = ({
  searchQuery,
  onSearchChange
}: FriendSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search by username, location or status..."
        className="pl-9 bg-white border-gray-300 focus-visible:ring-black text-black shadow-sm"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};
