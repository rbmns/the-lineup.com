
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NoResultsFoundProps {
  message?: string;
  searchQuery?: string;
  resetFilters: () => void;
}

export const NoResultsFound: React.FC<NoResultsFoundProps> = ({ 
  message,
  searchQuery, 
  resetFilters 
}) => {
  // Default message for no results with filters
  const defaultMessage = "No exact results found for your filters.";
  
  // Use provided message or default
  const displayMessage = message || defaultMessage;

  return (
    <div className="text-center py-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 mb-3">No matches found</h3>
        <p className="text-base leading-7 text-gray-600 mb-4">{displayMessage}</p>
        <Button 
          variant="default" 
          onClick={resetFilters}
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
        >
          Show all events instead
        </Button>
      </div>
    </div>
  );
};
