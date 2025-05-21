
import React from 'react';
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventsEmptyStateProps {
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  title?: string;
  message?: string;
  actionLabel?: string;
}

export const EventsEmptyState: React.FC<EventsEmptyStateProps> = ({
  onResetFilters,
  hasActiveFilters = false,
  title = hasActiveFilters ? "No events match your filters" : "No events found",
  message = hasActiveFilters 
    ? "No exact results found for your filters." 
    : "There are no events to display at the moment.",
  actionLabel = "Show all events instead",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <CalendarX className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{message}</p>
      
      {hasActiveFilters && onResetFilters && (
        <Button onClick={onResetFilters} variant="default" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EventsEmptyState;
