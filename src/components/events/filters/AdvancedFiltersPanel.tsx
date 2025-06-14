
import React from 'react';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { EventCategoryFilters } from '@/components/events/filters/EventCategoryFilters';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
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
  // Event category props
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
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
  className,
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll
}) => {
  if (!isOpen) return null;

  return (
    <div className={cn("border rounded-lg p-6 bg-white shadow-sm relative", className)}>
      {/* Close button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose}
        className="absolute top-4 right-4 h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close advanced filters</span>
      </Button>
      
      <h2 className="font-medium mb-6 text-lg">Advanced Filters</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Event Categories</h3>
          <div className="border rounded-md p-3">
            <EventCategoryFilters
              allEventTypes={allEventTypes}
              selectedEventTypes={selectedCategories}
              onToggleEventType={toggleCategory}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              className="space-y-2"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Date Range</h3>
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            onReset={() => onDateRangeChange(undefined)}
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={onDateFilterChange}
          />
        </div>

        <div className="space-y-3">
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
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Location</h3>
          <div className="flex items-center border rounded-md p-3 bg-gray-50 text-gray-600">
            <span className="text-sm">Zandvoort Area</span>
          </div>
        </div>
      </div>
    </div>
  );
};
