
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FriendSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const FriendSearchBar = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search by username, location or status..."
}: FriendSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full rounded-full bg-card border-border focus-visible:ring-primary text-foreground"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};
