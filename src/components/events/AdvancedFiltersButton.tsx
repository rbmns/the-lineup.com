
import React from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';

interface AdvancedFiltersButtonProps {
  hasActiveFilters: boolean;
  onOpen?: (isOpen: boolean) => void;
  isOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onReset?: () => void;
}

export const AdvancedFiltersButton: React.FC<AdvancedFiltersButtonProps> = ({
  hasActiveFilters,
  onOpen,
  isOpen,
  children,
  className,
  title = "Advanced Filters",
  onReset
}) => {
  const isMobile = useIsMobile();
  
  // On mobile use a bottom sheet instead of a popover
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpen}>
        <SheetTrigger asChild>
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
            <span>{title}</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#9b87f5] text-white text-xs">
                ✓
              </span>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent side="bottom" className="h-[80vh] px-4 py-6">
          <SheetHeader className="mb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {title}
              </SheetTitle>
              
              {hasActiveFilters && onReset && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onReset}
                  className="text-gray-500 hover:text-gray-700 h-8 px-2"
                >
                  <X className="h-4 w-4 mr-1" /> Reset
                </Button>
              )}
            </div>
          </SheetHeader>
          
          <div className="overflow-y-auto pb-16">
            {children}
          </div>
          
          <SheetFooter className="pt-4">
            <SheetClose asChild>
              <Button className="w-full">Done</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
  
  // Desktop: Use a popover
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
          <span>{title}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-4" align="end">
        <div className="space-y-4">
          {hasActiveFilters && onReset && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReset}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" /> Reset all
              </Button>
            </div>
          )}
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};
