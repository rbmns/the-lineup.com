
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import AdvancedFilters from '@/components/polymet/advanced-filters';
import { DateRange } from 'react-day-picker';

interface EventsAdvancedSectionProps {
  onFilterChange: (filters: any) => void;
  selectedEventTypes: string[];
  selectedVenues: string[];
  selectedVibes: string[];
  dateRange: DateRange | undefined;
  selectedDateFilter: string;
  filteredEventsCount: number;
  showLocationFilter?: boolean;
  allEventTypes: string[];
}

export const EventsAdvancedSection: React.FC<EventsAdvancedSectionProps> = ({
  onFilterChange,
  selectedEventTypes,
  selectedVenues,
  selectedVibes,
  dateRange,
  selectedDateFilter,
  filteredEventsCount,
  showLocationFilter = true,
  allEventTypes
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdvancedFilterChange = (filters: any) => {
    console.log('EventsAdvancedSection - Filter change:', filters);
    onFilterChange(filters);
  };

  const hasAdvancedFilters = selectedEventTypes.length > 0 || 
                            selectedVenues.length > 0 || 
                            !!dateRange || 
                            !!selectedDateFilter;

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
              {hasAdvancedFilters && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {[selectedEventTypes.length, selectedVenues.length, dateRange ? 1 : 0, selectedDateFilter ? 1 : 0]
                    .filter(n => n > 0).length}
                </span>
              )}
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <div className="text-sm text-gray-600">
            {filteredEventsCount} event{filteredEventsCount !== 1 ? 's' : ''} found
          </div>
        </div>
        
        <CollapsibleContent className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <AdvancedFilters
              onFilterChange={handleAdvancedFilterChange}
              initialFilters={{
                eventTypes: selectedEventTypes,
                venues: selectedVenues,
                eventVibes: selectedVibes,
                date: dateRange?.from,
                dateFilter: selectedDateFilter
              }}
              eventCategories={allEventTypes}
              className="w-full"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
