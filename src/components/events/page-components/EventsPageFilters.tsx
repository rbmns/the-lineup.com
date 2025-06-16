
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EventsFilterBar } from '@/components/events/page-components/EventsFilterBar';
import { EventsFilterPanel } from '@/components/events/page-components/EventsFilterPanel';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { LocationData } from '@/hooks/useLocation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EventsPageFiltersProps {
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  hasActiveFilters: boolean;
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
  dateRange: any;
  setDateRange: (range: any) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  venues: Array<{ value: string, label: string }>;
  selectedVenues: string[];
  setSelectedVenues: (venues: string[]) => void;
  locations: Array<{ value: string, label: string }>;
  hasAdvancedFilters: boolean;
  handleRemoveVenue: (venue: string) => void;
  handleClearDateFilter: () => void;
  resetFilters: () => void;
  selectedLocationId: string | null;
  onLocationChange: (id: string | null) => void;
}

export const EventsPageFilters: React.FC<EventsPageFiltersProps> = ({
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll,
  hasActiveFilters,
  showAdvancedFilters,
  toggleAdvancedFilters,
  dateRange,
  setDateRange,
  selectedDateFilter,
  setSelectedDateFilter,
  venues,
  selectedVenues,
  setSelectedVenues,
  locations,
  hasAdvancedFilters,
  handleRemoveVenue,
  handleClearDateFilter,
  resetFilters,
  selectedLocationId,
  onLocationChange,
}) => {
  const location = useLocation();
  const { saveFilterState } = useNavigationHistory();
  
  // Save filter state whenever it changes
  useEffect(() => {
    if (location.pathname === '/events') {
      const filterState = {
        eventTypes: selectedCategories,
        venues: selectedVenues,
        dateRange: dateRange,
        dateFilter: selectedDateFilter
      };
      
      saveFilterState(filterState);
      console.log("Filter state saved in EventsPageFilters", filterState);
    }
  }, [
    location.pathname,
    selectedCategories,
    selectedVenues,
    dateRange,
    selectedDateFilter,
    saveFilterState
  ]);

  return (
    <div className="space-y-4">
      {/* Main filter bar with location and advanced filter toggle */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
        <div className="flex-grow w-full">
          <EventsFilterBar
            allEventTypes={allEventTypes}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectAll={selectAll}
            deselectAll={deselectAll}
            hasActiveFilters={hasActiveFilters}
            showAdvancedFilters={showAdvancedFilters}
            toggleAdvancedFilters={toggleAdvancedFilters}
          />
        </div>
        <div className="flex-shrink-0 sm:w-auto w-full sm:max-w-xs">
          <div className="relative">
            <Select
              value={selectedLocationId || 'all-locations'}
              onValueChange={(value) => onLocationChange(value === 'all-locations' ? null : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by location..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLocationId && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => onLocationChange(null)}
                aria-label="Clear location filter"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Advanced Filters Panel & Filter Summary */}
      <EventsFilterPanel
        showAdvancedFilters={showAdvancedFilters}
        toggleAdvancedFilters={toggleAdvancedFilters}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        venues={venues}
        selectedVenues={selectedVenues}
        setSelectedVenues={setSelectedVenues}
        locations={locations}
        hasAdvancedFilters={hasAdvancedFilters}
        handleRemoveVenue={handleRemoveVenue}
        handleClearDateFilter={handleClearDateFilter}
        resetFilters={resetFilters}
        allEventTypes={allEventTypes}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        selectAll={selectAll}
        deselectAll={deselectAll}
      />
    </div>
  );
};
