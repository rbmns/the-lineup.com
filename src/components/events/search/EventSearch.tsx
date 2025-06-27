
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventSearchProps {
  placeholder?: string;
  className?: string;
  square?: boolean;
  onSearch?: (query: string) => void;
  initialValue?: string;
}

export const EventSearch: React.FC<EventSearchProps> = ({ 
  placeholder = "Search events...", 
  className,
  square = false,
  onSearch,
  initialValue = ""
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        className={cn(
          "w-full pl-10",
          square ? "rounded-lg" : "rounded-full"
        )}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <SearchIcon className="h-5 w-5" />
      </div>
    </div>
  );
};
