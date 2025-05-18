
import React from 'react';
import { X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryPill } from '@/components/ui/category-pill';
import { DateFilterPill } from '@/components/events/DateFilterPill';

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

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1 rounded-lg w-fit">
          <Tag className="h-4 w-4" />
          <span>what</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => (
            <CategoryPill 
              key={category} 
              category={category} 
              active={selectedEventTypes.includes(category)}
              onClick={() => toggleEventType(category)}
              showIcon={true}
              size="default"
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1 rounded-lg w-fit">
          <span>when</span>
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

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetFilters}
          className="text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-all duration-300"
        >
          <X className="h-4 w-4" />
          Reset filters
        </Button>
      )}
    </div>
  );
};
