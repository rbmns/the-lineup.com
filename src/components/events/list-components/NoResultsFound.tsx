
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';

export interface NoResultsFoundProps {
  message?: string;
  actionText?: string;
  showFiltersHint?: boolean;
  resetFilters?: () => void;
  searchQuery?: string;
  onAction?: () => void;
}

export const NoResultsFound: React.FC<NoResultsFoundProps> = ({
  message = "No events found",
  actionText = "Clear filters",
  showFiltersHint = false,
  resetFilters,
  searchQuery,
  onAction
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (resetFilters) {
      resetFilters();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FilterX className="h-10 w-10 text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        {message}
      </h2>
      
      {searchQuery && (
        <p className="mt-2 text-gray-600 text-center">
          No events matching "<span className="font-medium">{searchQuery}</span>"
        </p>
      )}
      
      {showFiltersHint && (
        <p className="mt-2 text-gray-600 text-center max-w-md">
          Try adjusting your filters or selecting different event categories
        </p>
      )}
      
      {(resetFilters || onAction) && (
        <Button 
          onClick={handleAction}
          variant="outline" 
          className="mt-6"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
