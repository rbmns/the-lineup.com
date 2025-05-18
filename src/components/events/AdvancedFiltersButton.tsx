
import React from 'react';
import { Filter, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
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
          variant={hasActiveFilters ? "default" : "outline"} 
          size="sm"
          onClick={() => onOpen && onOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 transition-all duration-200 shadow-sm", 
            hasActiveFilters ? "bg-slate-800 hover:bg-slate-900 text-white" : 
            "border-slate-300 text-slate-700 hover:bg-slate-50"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced Filters
          {isOpen ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
          {hasActiveFilters && (
            <span className="bg-white text-slate-800 text-xs px-1.5 py-0.5 rounded-full ml-1">
              Active
            </span>
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
          variant={hasActiveFilters ? "default" : "outline"} 
          size="sm"
          className={cn(
            "flex items-center gap-2 shadow-sm transition-all duration-200", 
            hasActiveFilters ? "bg-slate-800 hover:bg-slate-900 text-white" : 
            "border-slate-300 text-slate-700 hover:bg-slate-50",
            className
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced Filters
          {hasActiveFilters && (
            <span className="bg-white text-slate-800 text-xs px-1.5 py-0.5 rounded-full ml-1">
              Active
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-white border border-gray-200 shadow-md rounded-lg" align="start">
        <div className="space-y-4">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};
