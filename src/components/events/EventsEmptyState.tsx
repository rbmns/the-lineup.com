
import React from 'react';
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventsEmptyStateProps {
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  title?: string;
  message?: string;
  actionLabel?: string;
  noCategoriesSelected?: boolean;
}

export const EventsEmptyState: React.FC<EventsEmptyStateProps> = ({
  onResetFilters,
  hasActiveFilters = false,
  noCategoriesSelected = false,
  title = noCategoriesSelected 
    ? "No categories selected" 
    : (hasActiveFilters ? "No events match your filters" : "No events found"),
  message = noCategoriesSelected
    ? "Please select at least one category to view events."
    : (hasActiveFilters 
      ? "Try adjusting your search filters to find more events." 
      : "There are no events to display at the moment."),
  actionLabel = noCategoriesSelected ? "Show all events" : "Reset filters",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <CalendarX className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{message}</p>
      
      {(hasActiveFilters || noCategoriesSelected) && onResetFilters && (
        <Button onClick={onResetFilters} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EventsEmptyState;
