
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { EventTypesFilter } from '../EventTypesFilter';
import { VenueFilter } from '../VenueFilter';
import { DateRangeFilter } from '../DateRangeFilter';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { CategoryPill } from '@/components/ui/category-pill';

interface EventFilterSectionProps {
  showEventTypeFilter: boolean;
  setShowEventTypeFilter: (show: boolean) => void;
  showVenueFilter: boolean;
  setShowVenueFilter: (show: boolean) => void;
  showDateFilter: boolean;
  setShowDateFilter: (show: boolean) => void;
  selectedEventTypes: string[];
  setSelectedEventTypes: (types: string[]) => void;
  selectedVenues: string[];
  setSelectedVenues: (venues: string[]) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  availableEventTypes: Array<{value: string, label: string}>;
  availableVenues: Array<{value: string, label: string}>;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export const EventFilterSection: React.FC<EventFilterSectionProps> = ({
  showEventTypeFilter,
  setShowEventTypeFilter,
  showVenueFilter,
  setShowVenueFilter,
  showDateFilter,
  setShowDateFilter,
  selectedEventTypes,
  setSelectedEventTypes,
  selectedVenues,
  setSelectedVenues,
  dateRange,
  setDateRange,
  selectedDateFilter,
  setSelectedDateFilter,
  availableEventTypes,
  availableVenues,
  resetFilters,
  hasActiveFilters
}) => {
  const hasEventTypeFilters = selectedEventTypes.length > 0;
  const hasVenueFilters = selectedVenues.length > 0;
  const hasDateFilter = !!dateRange || !!selectedDateFilter;
  const isMobile = useIsMobile();
  
  // Use safe defaults for arrays to prevent React errors
  const safeEventTypes = Array.isArray(availableEventTypes) ? availableEventTypes : [];
  const safeVenues = Array.isArray(availableVenues) ? availableVenues : [];
  const safeSelectedEventTypes = Array.isArray(selectedEventTypes) ? selectedEventTypes : [];
  const safeSelectedVenues = Array.isArray(selectedVenues) ? selectedVenues : [];
  
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-medium text-sm">Filter by:</span>
        
        <DropdownMenu open={showEventTypeFilter} onOpenChange={setShowEventTypeFilter}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <CategoryPill 
                category={hasEventTypeFilters ? `${safeSelectedEventTypes.length} Selected` : "Event Type"} 
                active={hasEventTypeFilters}
                size="xs"
                className="px-2"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px] p-3 bg-white" align="start">
            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <EventTypesFilter
              eventTypes={safeEventTypes}
              selectedEventTypes={safeSelectedEventTypes}
              onEventTypeChange={setSelectedEventTypes}
              onReset={() => setSelectedEventTypes([])}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu open={showVenueFilter} onOpenChange={setShowVenueFilter}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <span className={cn(hasVenueFilters ? "font-medium" : "")}>
                {hasVenueFilters ? `Venue (${safeSelectedVenues.length})` : "Venue"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px] p-3 bg-white" align="start">
            <DropdownMenuLabel>Venues</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <VenueFilter
              venues={safeVenues}
              selectedVenues={safeSelectedVenues}
              onVenueChange={setSelectedVenues}
              onReset={() => setSelectedVenues([])}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu open={showDateFilter} onOpenChange={setShowDateFilter}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <span className={cn(hasDateFilter ? "font-medium" : "")}>
                {dateRange ? "Date Range" : 
                 selectedDateFilter ? selectedDateFilter : "Date"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={cn("p-3 bg-white", isMobile ? "w-[280px]" : "w-auto")} align="start">
            <DropdownMenuLabel>Date Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-2">
              <DateRangeFilter
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onReset={() => setDateRange(undefined)}
                selectedDateFilter={selectedDateFilter}
                onDateFilterChange={setSelectedDateFilter}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-800 h-9"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
