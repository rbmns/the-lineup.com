
import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AdvancedFiltersButtonProps {
  hasActiveFilters: boolean;
  className?: string;
  children: React.ReactNode;
}

export const AdvancedFiltersButton: React.FC<AdvancedFiltersButtonProps> = ({
  hasActiveFilters,
  className,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "flex items-center gap-2 border-gray-300", 
            hasActiveFilters ? "bg-gray-100" : "bg-white",
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
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-auto bg-white p-4 shadow-lg rounded-lg border border-gray-200 z-50" 
        align="start"
        sideOffset={8}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
