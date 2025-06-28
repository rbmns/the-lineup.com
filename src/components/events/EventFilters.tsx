
import React from 'react';
import { Tag, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryPill } from '@/components/ui/category-pill';
import { DateFilterPill } from '@/components/events/DateFilterPill';
import { ClearFiltersButton } from '@/components/events/filters/ClearFiltersButton';
import { DateRange } from 'react-day-picker';

interface EventFiltersProps {
  availableCategories: string[];
  selectedEventTypes: string[];
  toggleEventType: (eventType: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  dateRange?: DateRange;
  setDateRange?: (dateRange?: DateRange) => void;
  onToggleAdvancedFilters?: () => void;
  showAdvancedFilters?: boolean;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  availableCategories,
  selectedEventTypes,
  toggleEventType,
  resetFilters,
  hasActiveFilters,
  selectedDateFilter,
  setSelectedDateFilter,
  dateRange,
  setDateRange,
  onToggleAdvancedFilters,
  showAdvancedFilters
}) => {
  const dateFilters = [
    'today',
    'tomorrow',
    'this week',
    'this weekend',
    'next week',
    'later'
  ];

  // Get count of selected filters
  const eventTypeCount = selectedEventTypes.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Quick Filters</h2>
        
        <div className="flex items-center gap-2">
          <ClearFiltersButton 
            onClick={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
          {onToggleAdvancedFilters && (
            <Button
              variant={showAdvancedFilters ? "default" : "outline"}
              onClick={onToggleAdvancedFilters}
              className="flex items-center gap-1"
              size="sm"
            >
              <Filter className="h-4 w-4" />
              {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-ocean-deep/70 font-mono font-medium bg-coral/10 px-3 py-1.5 rounded-lg w-fit uppercase tracking-wide">
            <Tag className="h-4 w-4 text-coral" />
            <span>CATEGORY</span>
            {eventTypeCount > 0 && (
              <span className="px-1.5 py-0.5 bg-sungold/30 text-ocean-deep rounded-full text-xs font-medium">
                {eventTypeCount}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <CategoryPill 
                key={category} 
                category={category} 
                active={selectedEventTypes.includes(category)}
                onClick={() => toggleEventType(category)}
                showIcon={false}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-ocean-deep/70 font-mono font-medium bg-coral/10 px-3 py-1.5 rounded-lg w-fit uppercase tracking-wide">
            <span>DATE</span>
            {selectedDateFilter && selectedDateFilter !== 'anytime' && (
              <span className="px-1.5 py-0.5 bg-sungold/30 text-ocean-deep rounded-full text-xs font-medium">
                1
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {dateFilters.map((filter) => (
              <DateFilterPill
                key={filter}
                label={filter}
                active={selectedDateFilter === filter}
                onClick={() => {
                  if (selectedDateFilter === filter) {
                    setSelectedDateFilter('');
                  } else {
                    setSelectedDateFilter(filter);
                    if (setDateRange) setDateRange(undefined);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
