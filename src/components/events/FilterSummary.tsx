
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterSummaryProps {
  selectedEventTypes: string[];
  selectedVenues: string[];
  dateRange: DateRange | undefined;
  selectedDateFilter: string;
  eventTypeOptions: Array<{value: string, label: string}>;
  venueOptions: Array<{value: string, label: string}>;
  onRemoveEventType?: (type: string) => void;
  onRemoveVenue?: (venue: string) => void;
  onClearDateFilter?: () => void;
}

export const FilterSummary: React.FC<FilterSummaryProps> = ({
  selectedEventTypes,
  selectedVenues,
  dateRange,
  selectedDateFilter,
  eventTypeOptions,
  venueOptions,
  onRemoveEventType,
  onRemoveVenue,
  onClearDateFilter,
}) => {
  // No filters applied
  if (selectedEventTypes.length === 0 && 
      selectedVenues.length === 0 && 
      !dateRange?.from && 
      !selectedDateFilter) {
    return null;
  }

  // Handle event type display - show "X filters" when more than 3 are selected
  const renderEventTypes = () => {
    if (selectedEventTypes.length === 0) return null;

    if (selectedEventTypes.length > 3) {
      return (
        <Badge key="event-types" variant="outline" className="bg-gray-100 px-2 py-1 flex items-center gap-1">
          <span>{selectedEventTypes.length} event types</span>
          {onRemoveEventType && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 ml-1 hover:bg-gray-200 rounded-full"
              onClick={() => {
                // Clear all event types at once
                selectedEventTypes.forEach(type => onRemoveEventType(type));
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove all event types</span>
            </Button>
          )}
        </Badge>
      );
    }

    // Get display names for event types (up to 3)
    const displayEventTypes = selectedEventTypes.map(type => {
      return eventTypeOptions.find(opt => opt.value === type)?.label || type;
    });

    return displayEventTypes.map((typeName, index) => (
      <Badge key={`type-${index}`} variant="outline" className="bg-gray-100 px-2 py-1 flex items-center gap-1">
        <span>{typeName}</span>
        {onRemoveEventType && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1 hover:bg-gray-200 rounded-full"
            onClick={() => onRemoveEventType(selectedEventTypes[index])}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {typeName}</span>
          </Button>
        )}
      </Badge>
    ));
  };

  // Handle venue display - show "X filters" when more than 3 are selected
  const renderVenues = () => {
    if (selectedVenues.length === 0) return null;

    if (selectedVenues.length > 3) {
      return (
        <Badge key="venues" variant="outline" className="bg-gray-100 px-2 py-1 flex items-center gap-1">
          <span>{selectedVenues.length} venues</span>
          {onRemoveVenue && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 ml-1 hover:bg-gray-200 rounded-full"
              onClick={() => {
                // Clear all venues at once
                selectedVenues.forEach(venue => onRemoveVenue(venue));
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove all venues</span>
            </Button>
          )}
        </Badge>
      );
    }

    // Get display names for venues (up to 3)
    const displayVenues = selectedVenues.map(venue => {
      return venueOptions.find(opt => opt.value === venue)?.label || venue;
    });

    return displayVenues.map((venueName, index) => (
      <Badge key={`venue-${index}`} variant="outline" className="bg-gray-100 px-2 py-1 flex items-center gap-1">
        <span>{venueName}</span>
        {onRemoveVenue && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1 hover:bg-gray-200 rounded-full"
            onClick={() => onRemoveVenue(selectedVenues[index])}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {venueName}</span>
          </Button>
        )}
      </Badge>
    ));
  };

  // Format date range or date filter for display
  let dateDisplay = '';
  if (dateRange && dateRange.from) {
    if (dateRange.to) {
      dateDisplay = `${format(dateRange.from, 'MMM d, yyyy')} to ${format(dateRange.to, 'MMM d, yyyy')}`;
    } else {
      dateDisplay = `From ${format(dateRange.from, 'MMM d, yyyy')}`;
    }
  } else if (selectedDateFilter) {
    // Capitalize the first letter of each word in the date filter
    dateDisplay = selectedDateFilter
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className="mt-2 text-sm text-gray-600 flex items-center flex-wrap gap-2">
      <span className="font-medium">Results for:</span>
      
      {renderEventTypes()}
      {renderVenues()}
      
      {dateDisplay && (
        <Badge variant="outline" className="bg-gray-100 px-2 py-1 flex items-center gap-1">
          <span>Date: {dateDisplay}</span>
          {onClearDateFilter && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 ml-1 hover:bg-gray-200 rounded-full"
              onClick={onClearDateFilter}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear date filter</span>
            </Button>
          )}
        </Badge>
      )}
    </div>
  );
};
