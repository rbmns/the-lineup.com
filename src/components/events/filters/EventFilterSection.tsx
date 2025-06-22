
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Filter, X, Calendar, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdvancedFiltersPanel } from './AdvancedFiltersPanel';
import { cn } from '@/lib/utils';

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
  // New props for event categories
  allEventTypes?: string[];
  selectedCategories?: string[];
  toggleCategory?: (type: string) => void;
  selectAll?: () => void;
  deselectAll?: () => void;
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
  hasActiveFilters,
  // Event categories props
  allEventTypes = [],
  selectedCategories = [],
  toggleCategory = () => {},
  selectAll = () => {},
  deselectAll = () => {}
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasAdvancedFilters = selectedEventTypes.length > 0 || 
                            selectedVenues.length > 0 || 
                            !!dateRange || 
                            selectedDateFilter !== 'anytime';

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedEventTypes.length > 0) count += selectedEventTypes.length;
    if (selectedVenues.length > 0) count += selectedVenues.length;
    if (dateRange || selectedDateFilter !== 'anytime') count += 1;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Advanced Filters Toggle Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={showAdvancedFilters ? "default" : "outline"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={cn(
              "flex items-center gap-2 transition-all",
              showAdvancedFilters && "bg-primary text-white"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-white text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Reset all
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AdvancedFiltersPanel
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedDateFilter={selectedDateFilter}
        onDateFilterChange={setSelectedDateFilter}
        venues={availableVenues}
        selectedVenues={selectedVenues}
        onVenueChange={setSelectedVenues}
        locations={[]} // Can be expanded later
        allEventTypes={allEventTypes}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        selectAll={selectAll}
        deselectAll={deselectAll}
      />
    </div>
  );
};
