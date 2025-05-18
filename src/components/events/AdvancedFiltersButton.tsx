
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
  variant?: 'popover' | 'dropdown';
}

export const AdvancedFiltersButton: React.FC<AdvancedFiltersButtonProps> = ({
  hasActiveFilters,
  onOpen,
  isOpen,
  children,
  className,
  variant = 'popover'
}) => {
  if (variant === 'dropdown') {
    return (
      <div className={className}>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onOpen && onOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2", 
            hasActiveFilters ? "border-black/50" : ""
          )}
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isOpen && children}
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "default" : "outline"} 
          size="sm"
          className={cn(
            "flex items-center gap-2", 
            hasActiveFilters ? "bg-[#9b87f5] hover:bg-[#7E69AB]" : "",
            className
          )}
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {hasActiveFilters && (
            <span className="bg-white text-[#9b87f5] text-xs px-1.5 py-0.5 rounded-full">
              Active
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};
