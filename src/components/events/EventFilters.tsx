
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
    <div className="space-y-6 card-base">
      <div className="flex items-center justify-between">
        <h2 className="text-h4 font-montserrat font-semibold text-graphite-grey">Quick Filters</h2>
        
        <div className="flex items-center gap-2">
          <ClearFiltersButton 
            onClick={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
          {onToggleAdvancedFilters && (
            <Button
              variant={showAdvancedFilters ? "primary" : "secondary"}
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
          <div className="flex items-center gap-2 text-sm text-graphite-grey/70 font-montserrat font-semibold bg-sunrise-ochre/15 px-4 py-2 rounded-md w-fit uppercase tracking-wide">
            <Tag className="h-4 w-4 text-sunrise-ochre" />
            <span>CATEGORY</span>
            {eventTypeCount > 0 && (
              <span className="px-2 py-1 bg-ocean-teal/20 text-ocean-teal rounded-full text-xs font-medium">
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
          <div className="flex items-center gap-2 text-sm text-graphite-grey/70 font-montserrat font-semibold bg-sunrise-ochre/15 px-4 py-2 rounded-md w-fit uppercase tracking-wide">
            <span>DATE</span>
            {selectedDateFilter && selectedDateFilter !== 'anytime' && (
              <span className="px-2 py-1 bg-ocean-teal/20 text-ocean-teal rounded-full text-xs font-medium">
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
