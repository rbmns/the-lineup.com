
import React from 'react';

export interface NoResultsFoundProps {
  message: string;
  searchQuery?: string;
}

export const NoResultsFound: React.FC<NoResultsFoundProps> = ({ 
  message, 
  searchQuery = '' 
}) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-100">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          {searchQuery ? `No results found for "${searchQuery}"` : message}
        </h3>
        <p className="text-sm text-gray-500">
          {searchQuery
            ? "Try adjusting your search terms or filters"
            : "Check back soon for new events!"}
        </p>
      </div>
    </div>
  );
};

export default NoResultsFound;
