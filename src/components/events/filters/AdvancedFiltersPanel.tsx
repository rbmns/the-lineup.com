
import React from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

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
  selectedDateFilter,
  onDateFilterChange,
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

  // Preset date buttons
  const handleNextDays = (days: number) => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);
    
    onDateRangeChange({
      from: today,
      to: future
    });
    
    // Clear any selected date filter
    onDateFilterChange('');
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Date Range</h4>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
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
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="flex justify-between p-3 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDateRangeChange(undefined)}
                >
                  Clear
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleNextDays(7)}
                  >
                    Next 7 days
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleNextDays(30)}
                  >
                    Next 30 days
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Venue</h4>
        <Select 
          value={selectedVenues[0] || ""} 
          onValueChange={handleVenueSelect}
        >
          <SelectTrigger className="w-full">
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

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Location</h4>
        <Select 
          value={selectedLocation || ""} 
          onValueChange={(value) => onLocationChange?.(value)}
          disabled={!onLocationChange || locations.length === 0}
        >
          <SelectTrigger className="w-full">
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
