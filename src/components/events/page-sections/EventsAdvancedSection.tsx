
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { EventCategoryPills } from '@/components/events/EventCategoryPills';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { LocationFilter } from '@/components/events/filters/LocationFilter';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Event } from '@/types';

interface EventsAdvancedSectionProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  selectedVibes: string[];
  selectedLocation: string | null;
  dateRange: any;
  selectedDateFilter: string;
  filteredEventsCount: number;
  allEventTypes: string[];
  availableVenues: Array<{ value: string; label: string }>;
  events: Event[];
  venueAreas: Array<{ id: string; name: string }>;
  isLocationLoaded: boolean;
  areasLoading: boolean;
}

export const EventsAdvancedSection: React.FC<EventsAdvancedSectionProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  selectedVibes,
  selectedLocation,
  dateRange,
  selectedDateFilter,
  filteredEventsCount,
  allEventTypes,
  availableVenues,
  events,
  venueAreas,
  isLocationLoaded,
  areasLoading
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const isMobile = useIsMobile();

  const hasActiveFilters = selectedEventTypes.length > 0 || 
                          selectedVenues.length > 0 || 
                          selectedVibes.length > 0 ||
                          selectedLocation !== null ||
                          !!dateRange || 
                          (selectedDateFilter && selectedDateFilter !== '');

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedEventTypes.length > 0) count += selectedEventTypes.length;
    if (selectedVenues.length > 0) count += selectedVenues.length;
    if (selectedLocation !== null) count += 1;
    if (dateRange || (selectedDateFilter && selectedDateFilter !== '')) count += 1;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const handleToggleCategory = (category: string) => {
    const newTypes = selectedEventTypes.includes(category)
      ? selectedEventTypes.filter(t => t !== category)
      : [...selectedEventTypes, category];
    onFilterChange({ eventTypes: newTypes });
  };

  const handleSelectAllCategories = () => {
    onFilterChange({ eventTypes: allEventTypes });
  };

  const handleDeselectAllCategories = () => {
    onFilterChange({ eventTypes: [] });
  };

  const handleResetCategories = () => {
    onFilterChange({ eventTypes: [] });
  };

  const handleVenueChange = (venues: string[]) => {
    onFilterChange({ venues });
  };

  const handleLocationChange = (locationId: string | null) => {
    onFilterChange({ location: locationId });
  };

  const handleDateRangeChange = (range: any) => {
    onFilterChange({ date: range, dateFilter: '' });
  };

  const handleDateFilterChange = (filter: string) => {
    onFilterChange({ dateFilter: filter, date: undefined });
  };

  const handleResetAll = () => {
    onFilterChange({
      eventTypes: [],
      venues: [],
      vibes: [],
      location: null,
      date: undefined,
      dateFilter: ''
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Category Pills - Always visible */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-semibold tracking-tight text-primary`}>
            Browse by category
          </h2>
          {!isMobile && selectedEventTypes.length > 0 && (
            <div className="text-sm text-neutral-50">
              {selectedEventTypes.length} of {allEventTypes.length} categories selected
            </div>
          )}
        </div>
        
        <EventCategoryPills
          categories={allEventTypes}
          selectedCategories={selectedEventTypes}
          onToggleCategory={handleToggleCategory}
          onSelectAll={handleSelectAllCategories}
          onDeselectAll={handleDeselectAllCategories}
          onReset={handleResetCategories}
          showActions={!isMobile}
        />
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant={showAdvancedFilters ? "default" : "outline"}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={cn(
            "flex items-center gap-2 transition-all",
            showAdvancedFilters && "bg-primary text-white"
          )}
          size={isMobile ? "sm" : "default"}
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-white text-primary rounded-full px-2 py-0.5 text-xs font-medium">
              {activeFiltersCount}
            </span>
          )}
          {showAdvancedFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleResetAll}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Reset all
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location Filter */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Location</h3>
              <LocationFilter
                venueAreas={venueAreas}
                selectedLocationId={selectedLocation}
                onLocationChange={handleLocationChange}
                isLoading={areasLoading}
                isLocationLoaded={isLocationLoaded}
              />
            </div>

            {/* Venue Filter */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Venue</h3>
              <VenueFilter
                venues={availableVenues}
                selectedVenues={selectedVenues}
                onVenueChange={handleVenueChange}
                onReset={() => handleVenueChange([])}
              />
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Date</h3>
              <DateRangeFilter
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                onReset={() => handleDateRangeChange(undefined)}
                selectedDateFilter={selectedDateFilter}
                onDateFilterChange={handleDateFilterChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-600">
        {filteredEventsCount > 0 ? (
          <span>Showing {filteredEventsCount} event{filteredEventsCount !== 1 ? 's' : ''}</span>
        ) : (
          <span>No events found with current filters</span>
        )}
      </div>
    </div>
  );
};
