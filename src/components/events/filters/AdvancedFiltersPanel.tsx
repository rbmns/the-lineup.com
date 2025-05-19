
import React from 'react';
import { DateRangeFilter } from '@/components/events/DateRangeFilter';
import { VenueFilter } from '@/components/events/VenueFilter';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
  venues: Array<{value: string, label: string}>;
  selectedVenues: string[];
  onVenueChange: (venues: string[]) => void;
  locations?: Array<{value: string, label: string}>;
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
  className
}) => {
  if (!isOpen) return null;
  
  const handleVenueSelect = (value: string) => {
    if (selectedVenues.includes(value)) {
      onVenueChange(selectedVenues.filter(v => v !== value));
    } else {
      onVenueChange([...selectedVenues, value]);
    }
  };

  const handleLocationSelect = (value: string) => {
    // This is a placeholder for location filtering functionality
    console.log("Location selected:", value);
  };

  return (
    <div className={cn("border rounded-lg p-4 bg-white shadow-sm", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Date Range</h3>
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            onReset={() => onDateRangeChange(undefined)}
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={onDateFilterChange}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Venue</h3>
          <VenueFilter
            venues={venues}
            selectedVenues={selectedVenues}
            onVenueChange={onVenueChange}
            onReset={() => onVenueChange([])}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Location</h3>
          {locations.length > 0 ? (
            <Select onValueChange={handleLocationSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500">
              Select a venue to filter by location
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
