
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdvancedFiltersPanelProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
  venues: Array<{ value: string, label: string }>;
  selectedVenues: string[];
  onVenueChange: (venues: string[]) => void;
  locations?: Array<{ value: string, label: string }>;
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
  className?: string;
}

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({
  dateRange,
  onDateRangeChange,
  venues,
  selectedVenues,
  onVenueChange,
  locations = [],
  selectedLocation,
  onLocationChange,
  className
}) => {
  // Handle venue selection
  const handleVenueSelect = (venueId: string) => {
    // Toggle the venue selection
    if (selectedVenues.includes(venueId)) {
      onVenueChange(selectedVenues.filter(v => v !== venueId));
    } else {
      onVenueChange([...selectedVenues, venueId]);
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      <div>
        <h4 className="font-medium mb-2">Date Range</h4>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-300",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Select date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <h4 className="font-medium mb-2">Venue</h4>
        <Select 
          value={selectedVenues[0] || ""} 
          onValueChange={handleVenueSelect}
        >
          <SelectTrigger className="w-full border-gray-300">
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
      </div>

      <div>
        <h4 className="font-medium mb-2">Location</h4>
        <Select 
          value={selectedLocation || ""} 
          onValueChange={(value) => onLocationChange?.(value)}
          disabled={!onLocationChange || locations.length === 0}
        >
          <SelectTrigger className="w-full border-gray-300">
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
      </div>
    </div>
  );
};
