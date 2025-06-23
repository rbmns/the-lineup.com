
import React, { useRef, useEffect } from 'react';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { EventCategoryFilters } from '@/components/events/filters/EventCategoryFilters';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  // Location/venue selection props
  selectedLocationId?: string | null;
  onLocationChange?: (id: string | null) => void;
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
  deselectAll,
  selectedLocationId,
  onLocationChange
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={onClose}
      />
      
      <div 
        ref={panelRef}
        className={cn(
          "fixed inset-x-4 top-20 z-50 max-h-[80vh] overflow-hidden border rounded-lg bg-white shadow-lg",
          "md:relative md:inset-x-0 md:top-0 md:max-h-none md:shadow-md",
          className
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="font-semibold text-lg text-primary">Advanced Filters</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close advanced filters</span>
          </Button>
        </div>
        
        {/* Scrollable content */}
        <ScrollArea className="max-h-[calc(80vh-80px)] md:max-h-none">
          <div className="p-4 md:p-6 space-y-6">
            <div className="space-y-6 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-6 md:space-y-0">
              {/* Event Categories Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary">Event Categories</h3>
                <div className="border border-gray-200 rounded-md p-3 bg-gray-50/50">
                  <ScrollArea className="max-h-48">
                    <EventCategoryFilters
                      allEventTypes={allEventTypes}
                      selectedEventTypes={selectedCategories}
                      onToggleEventType={toggleCategory}
                      onSelectAll={selectAll}
                      onDeselectAll={deselectAll}
                      className="space-y-2"
                    />
                  </ScrollArea>
                </div>
              </div>

              {/* Date Range Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary">Date Range</h3>
                <div className="border border-gray-200 rounded-md p-3 bg-gray-50/50">
                  <DateRangeFilter
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                    onReset={() => onDateRangeChange(undefined)}
                    selectedDateFilter={selectedDateFilter}
                    onDateFilterChange={onDateFilterChange}
                  />
                </div>
              </div>

              {/* Venue Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary">Venue</h3>
                <div className="border border-gray-200 rounded-md p-1 bg-gray-50/50">
                  <ScrollArea className="h-[180px] pr-3">
                    <div className="p-2">
                      <VenueFilter
                        venues={venues}
                        selectedVenues={selectedVenues}
                        onVenueChange={onVenueChange}
                        onReset={() => onVenueChange([])}
                      />
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            {/* All Venues Selector - Mobile optimized */}
            {locations.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-primary">Filter by Venue Location</h3>
                <div className="relative">
                  <Select
                    value={selectedLocationId || 'all-venues'}
                    onValueChange={(value) => {
                      if (onLocationChange) {
                        onLocationChange(value === 'all-venues' ? null : value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Filter by venue..." />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-white shadow-lg border border-gray-200 z-50 max-h-60"
                      position="popper"
                      sideOffset={4}
                    >
                      <SelectItem value="all-venues">All Venues</SelectItem>
                      {locations.map(loc => (
                        <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedLocationId && onLocationChange && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => onLocationChange(null)}
                      aria-label="Clear venue filter"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
