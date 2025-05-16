
import React from 'react';
import { Button } from '@/components/ui/button';

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
  // Customize message based on whether there's a search query
  const displayMessage = message || (searchQuery 
    ? `We couldn't find exact matches for "${searchQuery}".`
    : 'No matches found for your current filters.');

  return (
    <div className="text-center py-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-gray-900 mb-3">No matches found</h3>
        <p className="text-gray-600 mb-4">{displayMessage}</p>
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="bg-white hover:bg-gray-100"
        >
          Clear all filters
        </Button>
      </div>
    </div>
  );
};
