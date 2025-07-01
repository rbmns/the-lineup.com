
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MobileFriendlyDatePicker } from './MobileFriendlyDatePicker';
import { VenueFilter } from './VenueFilter';
import { CategoryFilterSection } from './CategoryFilterSection';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
  venues: Array<{ value: string, label: string }>;
  selectedVenues: string[];
  onVenueChange: (venues: string[]) => void;
  locations: Array<{ value: string, label: string }>;
  className?: string;
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
  locations,
  className,
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll
}) => {
  if (!isOpen) return null;

  const handleClearDateFilter = () => {
    onDateFilterChange('anytime');
    onDateRangeChange(undefined);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Date Filters Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Date & Time
          </h3>
          <MobileFriendlyDatePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={onDateFilterChange}
            onReset={handleClearDateFilter}
          />
        </div>

        {/* Venue Filters Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Venues
          </h3>
          <VenueFilter
            venues={venues}
            selectedVenues={selectedVenues}
            onVenueChange={onVenueChange}
          />
        </div>

        {/* Category Filters Section - Mobile Only */}
        <div className="space-y-3 md:hidden">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Categories
          </h3>
          <CategoryFilterSection
            allEventTypes={allEventTypes}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectAll={selectAll}
            deselectAll={deselectAll}
          />
        </div>
      </CardContent>
    </Card>
  );
};
