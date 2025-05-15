
import React from 'react';
import { CalendarX } from 'lucide-react';

export interface EventsEmptyStateProps {
  hasActiveFilters?: boolean;
  message?: string;
}

export const EventsEmptyState: React.FC<EventsEmptyStateProps> = ({
  hasActiveFilters = false,
  message = 'No events found'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <CalendarX className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-gray-500 max-w-md">
        {hasActiveFilters 
          ? 'Try adjusting your filters or search criteria to find more events.' 
          : 'Check back later for new events or try a different search.'}
      </p>
    </div>
  );
};

export default EventsEmptyState;
