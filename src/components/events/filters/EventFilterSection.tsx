
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  
  // Advanced filters dropdown state
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
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
          <DropdownMenuContent className="w-[240px] p-3 bg-white shadow-lg border border-gray-200 rounded-lg" align="start">
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
          <DropdownMenuContent className="w-[240px] p-3 bg-white shadow-lg border border-gray-200 rounded-lg" align="start">
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
          <DropdownMenuContent className={cn("p-3 bg-white shadow-lg border border-gray-200 rounded-lg", isMobile ? "w-[280px]" : "w-auto")} align="start">
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

        <div className="relative">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="h-9 bg-black text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            {showAdvancedFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {showAdvancedFilters && (
            <div className="absolute left-0 mt-2 w-[calc(100vw-40px)] max-w-3xl bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Date Range</h3>
                  <DateRangeFilter
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    onReset={() => setDateRange(undefined)}
                    selectedDateFilter={selectedDateFilter}
                    onDateFilterChange={setSelectedDateFilter}
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Venue</h3>
                  <div className="max-h-64 overflow-y-auto pr-2">
                    <VenueFilter
                      venues={safeVenues}
                      selectedVenues={safeSelectedVenues}
                      onVenueChange={setSelectedVenues}
                      onReset={() => setSelectedVenues([])}
                    />
                    {safeVenues.length > 5 && (
                      <div className="flex justify-center mt-1">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

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
