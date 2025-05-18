
import React from 'react';
import { cn } from '@/lib/utils';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  locations?: Array<{ value: string, label: string }>;
  selectedLocations?: string[];
  onLocationChange?: (locations: string[]) => void;
  className?: string;
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
  locations = [],
  selectedLocations = [],
  onLocationChange = () => {},
  className
}) => {
  if (!isOpen) return null;

  // Handle venue selection
  const handleVenueSelect = (venueId: string) => {
    // Toggle the venue selection
    if (selectedVenues.includes(venueId)) {
      onVenueChange(selectedVenues.filter(v => v !== venueId));
    } else {
      onVenueChange([...selectedVenues, venueId]);
    }
  };
  
  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    if (selectedLocations.includes(locationId)) {
      onLocationChange(selectedLocations.filter(l => l !== locationId));
    } else {
      onLocationChange([...selectedLocations, locationId]);
    }
  };

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-md max-w-4xl mx-auto animate-fade-in", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Date Range</h4>
          <div className="border border-gray-200 rounded-md p-3 bg-white shadow-sm hover:border-gray-300 transition-colors">
            <DateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
              onReset={() => onDateRangeChange(undefined)}
              selectedDateFilter={selectedDateFilter}
              onDateFilterChange={onDateFilterChange}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Venue</h4>
          <Select 
            value={selectedVenues[0] || ""} 
            onValueChange={handleVenueSelect}
          >
            <SelectTrigger className="w-full bg-white border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
              <SelectValue placeholder="Select venue" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-md">
              {venues.map((venue) => (
                <SelectItem key={venue.value} value={venue.value}>
                  {venue.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Location</h4>
          <Select 
            value={selectedLocations[0] || ""} 
            onValueChange={handleLocationSelect}
          >
            <SelectTrigger className="w-full bg-white border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-md">
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
