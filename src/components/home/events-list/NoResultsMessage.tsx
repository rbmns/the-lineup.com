
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoResultsMessageProps {
  searchQuery?: string;
  resetFilters: () => void;
}

export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ 
  searchQuery, 
  resetFilters 
}) => {
  return (
    <div className="text-center py-8 max-w-xl mx-auto">
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-gray-900 mb-3">No direct matches found</h3>
        <p className="text-gray-600 mb-4">
          We couldn't find exact matches for "{searchQuery}", but here are some similar events that might interest you.
        </p>
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="bg-white hover:bg-gray-100"
        >
          Clear search
        </Button>
      </div>
    </div>
  );
};
