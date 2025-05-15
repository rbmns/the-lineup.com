
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoResultsFoundProps {
  searchQuery?: string;
  resetFilters: () => void;
}

export const NoResultsFound: React.FC<NoResultsFoundProps> = ({ 
  searchQuery, 
  resetFilters 
}) => {
  return (
    <div className="text-center py-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-gray-900 mb-3">No exact matches found</h3>
        <p className="text-gray-600 mb-4">
          {searchQuery 
            ? `We couldn't find exact matches for "${searchQuery}".`
            : 'No matches found for your current filters.'}
        </p>
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
