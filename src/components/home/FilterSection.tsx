
import React from 'react';
import { Tag } from 'lucide-react';
import { CategoryPill } from '@/components/ui/category-pill';
import { DateFilterPill } from '@/components/events/DateFilterPill';
import { ClearFiltersButton } from '@/components/events/filters/ClearFiltersButton';

interface FilterSectionProps {
  availableCategories: string[];
  selectedEventTypes: string[];
  toggleEventType: (eventType: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  availableCategories,
  selectedEventTypes,
  toggleEventType,
  resetFilters,
  hasActiveFilters,
  selectedDateFilter,
  setSelectedDateFilter
}) => {
  const dateFilters = [
    'today',
    'tomorrow',
    'this week',
    'this weekend',
    'next week',
    'later'
  ];
  
  const handleToggleEventType = (eventType: string) => {
    toggleEventType(eventType);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <ClearFiltersButton 
          onClick={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-ocean-deep/70 font-mono font-medium bg-coral/10 px-3 py-1.5 rounded-lg w-fit uppercase tracking-wide">
            <Tag className="h-4 w-4 text-coral" />
            <span>CATEGORY</span>
            {selectedEventTypes.length > 0 && (
              <span className="px-1.5 py-0.5 bg-sungold/30 text-ocean-deep rounded-full text-xs font-medium">
                {selectedEventTypes.length}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <CategoryPill 
                key={category} 
                category={category} 
                active={selectedEventTypes.includes(category)}
                onClick={() => handleToggleEventType(category)}
                showIcon={true}
                size="default"
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-ocean-deep/70 font-mono font-medium bg-coral/10 px-3 py-1.5 rounded-lg w-fit uppercase tracking-wide">
            <span>DATE</span>
            {selectedDateFilter && (
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
