
import React from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AdvancedFiltersButtonProps {
  hasActiveFilters: boolean;
  onOpen?: (isOpen: boolean) => void;
  isOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AdvancedFiltersButton: React.FC<AdvancedFiltersButtonProps> = ({
  hasActiveFilters,
  onOpen,
  isOpen,
  children,
  className
}) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "flex items-center gap-2", 
            hasActiveFilters && "bg-gray-100 border-gray-300",
            className
          )}
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="space-y-4">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};
