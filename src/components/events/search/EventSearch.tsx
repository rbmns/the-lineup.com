
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

interface EventSearchProps {
  placeholder?: string;
  className?: string;
}

export const EventSearch: React.FC<EventSearchProps> = ({ 
  placeholder = "Search events...", 
  className 
}) => {
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-full pl-10"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <SearchIcon className="h-5 w-5" />
      </div>
    </div>
  );
};
