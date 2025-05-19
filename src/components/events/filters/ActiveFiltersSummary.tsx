
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActiveFiltersSummaryProps {
  selectedVenues: string[];
  venues: Array<{value: string, label: string}>;
  dateRange?: DateRange;
  selectedDateFilter: string;
  hasAdvancedFilters: boolean;
  handleRemoveVenue: (venueId: string) => void;
  handleClearDateFilter: () => void;
  resetFilters: () => void;
  className?: string;
}

export const ActiveFiltersSummary: React.FC<ActiveFiltersSummaryProps> = ({
  selectedVenues,
  venues,
  dateRange,
  selectedDateFilter,
  hasAdvancedFilters,
  handleRemoveVenue,
  handleClearDateFilter,
  resetFilters,
  className
}) => {
  if (!hasAdvancedFilters) return null;
  
  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'MMM d, yyyy') : '';
  };
  
  const getDateRangeLabel = () => {
    if (selectedDateFilter) return selectedDateFilter;
    if (dateRange?.from && dateRange?.to) {
      return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
    }
    if (dateRange?.from) {
      return `From ${formatDate(dateRange.from)}`;
    }
    return '';
  };
  
  return (
    <div className={cn("flex flex-wrap gap-2 items-center mb-4", className)}>
      <span className="text-sm text-gray-500">Active filters:</span>
      
      {selectedVenues.map(venueId => {
        const venue = venues.find(v => v.value === venueId);
        return venue ? (
          <div key={venueId} className="bg-[#9b87f5] text-white rounded-full px-3 py-1 text-xs flex items-center">
            <span>Venue: {venue.label}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-1 h-4 w-4 p-0 text-white hover:text-white hover:bg-transparent" 
              onClick={() => handleRemoveVenue(venueId)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : null;
      })}
      
      {(dateRange || selectedDateFilter) && (
        <div className="bg-[#9b87f5] text-white rounded-full px-3 py-1 text-xs flex items-center">
          <span>Date: {getDateRangeLabel()}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-1 h-4 w-4 p-0 text-white hover:text-white hover:bg-transparent" 
            onClick={handleClearDateFilter}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {hasAdvancedFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-gray-500"
          onClick={resetFilters}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};
