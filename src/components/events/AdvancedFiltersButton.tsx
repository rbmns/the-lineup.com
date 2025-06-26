
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
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
          variant={hasActiveFilters ? "primary" : "outline"} 
          size="sm"
          radius="sm"
          onClick={() => onOpen && onOpen(!isOpen)}
          className={cn("w-9 h-9 p-0")}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full transform translate-x-1/3 -translate-y-1/3"></span>
          )}
        </Button>
        {isOpen && (
          <div className="mt-2 animate-fade-in">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "primary" : "outline"} 
          size="sm"
          radius="sm"
          className={cn(
            "w-9 h-9 p-0", 
            className
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full transform translate-x-1/3 -translate-y-1/3"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[calc(100vw-2rem)] sm:w-[500px] md:w-[600px] p-4 bg-white border border-gray-200 shadow-md rounded-lg z-50" 
        align="start"
      >
        <div className="space-y-4">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};
