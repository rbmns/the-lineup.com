
import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventsEmptyStateProps {
  message?: string;
  subMessage?: string;
  resetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export const EventsEmptyState: React.FC<EventsEmptyStateProps> = ({ 
  message = "No events found", 
  subMessage = "Try adjusting your filters or search terms",
  resetFilters,
  hasActiveFilters = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm max-w-md mx-auto w-full">
        <SearchX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600 mb-6">{subMessage}</p>
        
        {resetFilters && hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="mx-auto"
          >
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventsEmptyState;
