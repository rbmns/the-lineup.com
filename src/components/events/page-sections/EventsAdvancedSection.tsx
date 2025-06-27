
import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryPill } from '@/components/ui/category-pill';
import { DateFilterPill } from '@/components/events/DateFilterPill';
import { Event } from '@/types';
import { cn } from '@/lib/utils';

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
  availableVenues: Array<{ value: string, label: string }>;
  events: Event[];
  venueAreas: any[];
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
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = selectedEventTypes.length > 0 || selectedVenues.length > 0 || selectedDateFilter !== '';
  const activeFiltersCount = selectedEventTypes.length + selectedVenues.length + (selectedDateFilter ? 1 : 0);

  const dateFilters = ['today', 'tomorrow', 'this week', 'this weekend', 'next week', 'later'];

  const toggleEventType = (eventType: string) => {
    const newTypes = selectedEventTypes.includes(eventType)
      ? selectedEventTypes.filter(t => t !== eventType)
      : [...selectedEventTypes, eventType];
    onFilterChange({ eventTypes: newTypes });
  };

  const toggleDateFilter = (filter: string) => {
    const newFilter = selectedDateFilter === filter ? '' : filter;
    onFilterChange({ dateFilter: newFilter });
  };

  const resetFilters = () => {
    onFilterChange({
      eventTypes: [],
      venues: [],
      dateFilter: '',
      date: undefined
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 bg-[#2A9D8F] text-white rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredEventsCount} events
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-4">
          {/* Categories */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-700">Categories</h4>
              {selectedEventTypes.length > 0 && (
                <span className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  {selectedEventTypes.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allEventTypes.slice(0, 8).map((category) => (
                <CategoryPill 
                  key={category} 
                  category={category} 
                  active={selectedEventTypes.includes(category)}
                  onClick={() => toggleEventType(category)}
                  showIcon={false}
                  size="sm"
                  className="text-xs"
                />
              ))}
            </div>
          </div>

          {/* Date Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-700">When</h4>
              {selectedDateFilter && (
                <span className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  1
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dateFilters.map((filter) => (
                <DateFilterPill
                  key={filter}
                  label={filter}
                  active={selectedDateFilter === filter}
                  onClick={() => toggleDateFilter(filter)}
                  size="sm"
                  className="text-xs"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
