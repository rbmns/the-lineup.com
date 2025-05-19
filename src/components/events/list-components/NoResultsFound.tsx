
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface NoResultsFoundProps {
  resetFilters: () => void;
  message?: string;
  searchQuery?: string;
}

export const NoResultsFound: React.FC<NoResultsFoundProps> = ({ 
  resetFilters, 
  message,
  searchQuery
}) => {
  // If we have a search query, use it in the default message
  const defaultMessage = searchQuery
    ? `No events found matching "${searchQuery}".`
    : "No events found matching your filters.";
    
  // Use provided message or default message
  const displayMessage = message || defaultMessage;
  
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm max-w-md">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-10 w-10 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          {displayMessage}
        </h3>
        <Button 
          onClick={resetFilters} 
          className="mt-4"
          variant="default"
        >
          Show All Events
        </Button>
      </div>
    </div>
  );
};
