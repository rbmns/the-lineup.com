
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventSearchProps {
  placeholder?: string;
  className?: string;
  square?: boolean;
}

export const EventSearch: React.FC<EventSearchProps> = ({ 
  placeholder = "Search events...", 
  className,
  square = false
}) => {
  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
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
