
import React from 'react';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';

interface ActiveFiltersSummaryProps {
  selectedVenues: string[];
  venues: Array<{ value: string, label: string }>;
  dateRange: DateRange | undefined;
  selectedDateFilter: string;
  hasAdvancedFilters: boolean;
  handleRemoveVenue: (venueId: string) => void;
  handleClearDateFilter: () => void;
  resetFilters: () => void;
}

export const ActiveFiltersSummary: React.FC<ActiveFiltersSummaryProps> = ({
  selectedVenues,
  venues,
  dateRange,
  selectedDateFilter,
  hasAdvancedFilters,
  handleRemoveVenue,
  handleClearDateFilter,
  resetFilters
}) => {
  if (!hasAdvancedFilters) return null;
  
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        {selectedVenues.map(venueId => {
          const venue = venues.find(v => v.value === venueId);
          return venue ? (
            <div key={venueId} className="bg-purple-100 text-purple-900 rounded-full px-3 py-1 text-xs flex items-center">
              <span>Venue: {venue.label}</span>
              <button 
                className="ml-1 h-4 w-4 p-0" 
                onClick={() => handleRemoveVenue(venueId)}
              >
                &times;
              </button>
            </div>
          ) : null;
        })}
        
        {(dateRange || selectedDateFilter) && (
          <div className="bg-purple-100 text-purple-900 rounded-full px-3 py-1 text-xs flex items-center">
            <span>
              Date: {selectedDateFilter || (dateRange ? 'Custom range' : '')}
            </span>
            <button 
              className="ml-1 h-4 w-4 p-0" 
              onClick={handleClearDateFilter}
            >
              &times;
            </button>
          </div>
        )}
        
        {hasAdvancedFilters && (
          <button 
            className="text-xs text-purple-700 hover:text-purple-900"
            onClick={resetFilters}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};
