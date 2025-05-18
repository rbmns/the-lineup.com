
import React from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className={cn("bg-white border rounded-lg p-6 space-y-8", className)}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Advanced Filters</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Date Range</h4>
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            onReset={() => onDateRangeChange(undefined)}
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={onDateFilterChange}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-sm">Venue Filter</h4>
          <Select 
            value={selectedVenues[0] || ""} 
            onValueChange={handleVenueSelect}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select venue" />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem key={venue.value} value={venue.value}>
                  {venue.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedVenues.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedVenues.map(venueId => {
                const venue = venues.find(v => v.value === venueId);
                return venue ? (
                  <div key={venueId} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span>{venue.label}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-1 h-5 w-5 p-0" 
                      onClick={() => onVenueChange(selectedVenues.filter(v => v !== venueId))}
                    >
                      &times;
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        {locations.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Location Filter</h4>
            <Select 
              value={selectedLocations[0] || ""} 
              onValueChange={handleLocationSelect}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedLocations.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedLocations.map(locationId => {
                  const location = locations.find(l => l.value === locationId);
                  return location ? (
                    <div key={locationId} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                      <span>{location.label}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-1 h-5 w-5 p-0" 
                        onClick={() => onLocationChange(selectedLocations.filter(l => l !== locationId))}
                      >
                        &times;
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
