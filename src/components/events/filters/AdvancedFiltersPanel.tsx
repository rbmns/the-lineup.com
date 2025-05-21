
import React from 'react';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
  venues: Array<{value: string, label: string}>;
  selectedVenues: string[];
  onVenueChange: (venues: string[]) => void;
  locations?: Array<{value: string, label: string}>;
  className?: string;
}

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({
  isOpen,
  onClose,
  dateRange,
  onDateRangeChange,
  selectedDateFilter,
  onDateFilterChange,
  venues,
  selectedVenues,
  onVenueChange,
  locations = [],
  className
}) => {
  if (!isOpen) return null;

  return (
    <div className={cn("border rounded-lg p-4 bg-white shadow-sm relative", className)}>
      {/* Close button - more visible on mobile */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose}
        className="absolute top-2 right-2 h-8 w-8 p-0 md:flex items-center justify-center sm:hidden"
        aria-label="Close advanced filters"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <h2 className="font-medium mb-4 text-lg">Advanced Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Date Range</h3>
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            onReset={() => onDateRangeChange(undefined)}
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={onDateFilterChange}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Venue</h3>
          <div className="border rounded-md p-1 relative">
            <div className="flex flex-col items-center mb-1 px-1">
              <ChevronUp className="h-3 w-3 text-gray-400" />
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </div>
            <ScrollArea className="h-[180px] pr-3">
              <VenueFilter
                venues={venues}
                selectedVenues={selectedVenues}
                onVenueChange={onVenueChange}
                onReset={() => onVenueChange([])}
              />
            </ScrollArea>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Location</h3>
          <div className="flex items-center border rounded-md p-2">
            <span className="text-sm">Zandvoort Area</span>
          </div>
        </div>
      </div>
      
      {/* Mobile-friendly close button at bottom */}
      <div className="mt-4 text-center sm:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
          className="w-full"
        >
          Close
          <X className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
