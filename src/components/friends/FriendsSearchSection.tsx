
import React from 'react';
import { Search } from 'lucide-react';

interface FriendsSearchSectionProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const FriendsSearchSection: React.FC<FriendsSearchSectionProps> = ({
  searchQuery,
  onSearchChange,
  disabled = false
}) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends by name..."
            value={searchQuery}
            onChange={onSearchChange}
            disabled={disabled}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
      </div>
    </div>
  );
};
