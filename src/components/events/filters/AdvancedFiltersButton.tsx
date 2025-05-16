
import React, { useState } from 'react';
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
  isOpen?: boolean;
  onOpen?: (isOpen: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

export const AdvancedFiltersButton: React.FC<AdvancedFiltersButtonProps> = ({
  hasActiveFilters,
  isOpen,
  onOpen,
  className,
  children
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const handleOpenChange = (open: boolean) => {
    if (onOpen) {
      onOpen(open);
    } else {
      setInternalOpen(open);
    }
  };
  
  const currentOpen = isOpen !== undefined ? isOpen : internalOpen;
  
  return (
    <Popover open={currentOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "secondary" : "outline"} 
          size="sm"
          className={cn(
            "flex items-center gap-2", 
            hasActiveFilters && "bg-gray-100 border-gray-300",
            className
          )}
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {currentOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200"
        align="start"
        sideOffset={8}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};
