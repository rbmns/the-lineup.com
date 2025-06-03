
import React from 'react';
import { AdvancedFiltersToggle } from '@/components/events/filters/AdvancedFiltersToggle';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';

interface EventsFilterBarProps {
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  hasActiveFilters: boolean;
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
}

export const EventsFilterBar: React.FC<EventsFilterBarProps> = ({
  allEventTypes,
  selectedCategories,
  toggleCategory,
  selectAll,
  deselectAll,
  hasActiveFilters,
  showAdvancedFilters,
  toggleAdvancedFilters
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {/* Location indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Zandvoort area</span>
        </div>
        
        {/* Advanced Filters Toggle */}
        <AdvancedFiltersToggle 
          showAdvancedFilters={showAdvancedFilters}
          toggleAdvancedFilters={toggleAdvancedFilters}
        />
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            deselectAll();
          }}
          className="text-gray-500 hover:text-gray-800 flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Reset filters
        </Button>
      )}
    </div>
  );
};
