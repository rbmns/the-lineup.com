
import React, { useState } from 'react';
import { EventCategoryFilters } from './filters/EventCategoryFilters';
import { AdvancedFiltersButton } from './AdvancedFiltersButton';
import { DateRangeFilter } from './DateRangeFilter';
import { VenueFilter } from './VenueFilter';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface NewFilterSectionProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAllEventTypes: () => void;
  onDeselectAllEventTypes: () => void;
  resetAllFilters: () => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  selectedVenues: string[];
  setSelectedVenues: (venues: string[]) => void;
  availableVenues: Array<{value: string, label: string}>;
  hasAdvancedFilters: boolean;
}

export const NewFilterSection: React.FC<NewFilterSectionProps> = ({
  allEventTypes,
  selectedEventTypes,
  onToggleEventType,
  onSelectAllEventTypes,
  onDeselectAllEventTypes,
  resetAllFilters,
  dateRange,
  setDateRange,
  selectedDateFilter,
  setSelectedDateFilter,
  selectedVenues,
  setSelectedVenues,
  availableVenues,
  hasAdvancedFilters
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const hasDateFilter = !!dateRange || !!selectedDateFilter;
  const hasVenueFilter = selectedVenues.length > 0;
  const hasActiveAdvancedFilters = hasDateFilter || hasVenueFilter;

  const handleResetDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
  };
  
  const handleResetVenueFilter = () => {
    setSelectedVenues([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Filter by category</h2>
          
          <div className="flex items-center gap-2">
            <AdvancedFiltersButton
              hasActiveFilters={hasActiveAdvancedFilters}
              isOpen={showAdvancedFilters}
              onOpen={setShowAdvancedFilters}
            >
              <div className="space-y-4">
                <h3 className="font-medium">Date</h3>
                <DateRangeFilter
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  onReset={handleResetDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  onDateFilterChange={setSelectedDateFilter}
                />
                
                <h3 className="font-medium pt-2">Venue</h3>
                <VenueFilter
                  venues={availableVenues}
                  selectedVenues={selectedVenues}
                  onVenueChange={setSelectedVenues}
                  onReset={handleResetVenueFilter}
                />
              </div>
            </AdvancedFiltersButton>
            
            {hasAdvancedFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resetAllFilters}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Reset all
              </Button>
            )}
          </div>
        </div>
        
        <EventCategoryFilters
          allEventTypes={allEventTypes}
          selectedEventTypes={selectedEventTypes}
          onToggleEventType={onToggleEventType}
          onSelectAll={onSelectAllEventTypes}
          onDeselectAll={onDeselectAllEventTypes}
          onReset={resetAllFilters}
        />
      </div>
    </div>
  );
};
