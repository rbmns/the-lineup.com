
import React from 'react';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className={cn("border rounded-lg p-4 bg-white shadow-sm", className)}>
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
            <ScrollArea className="h-[180px] pr-3">
              <VenueFilter
                venues={venues}
                selectedVenues={selectedVenues}
                onVenueChange={onVenueChange}
                onReset={() => onVenueChange([])}
              />
            </ScrollArea>
            <div className="absolute right-2 bottom-2 text-xs text-gray-400 bg-white px-1 rounded-sm">
              Scroll for more
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Location</h3>
          <div className="text-sm p-2 bg-gray-50 rounded-md border">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Zandvoort Area</span>
              <span className="text-xs text-gray-500">(fixed)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
