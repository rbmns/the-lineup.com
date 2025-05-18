
import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';

interface AdvancedFiltersToggleProps {
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
}

export const AdvancedFiltersToggle: React.FC<AdvancedFiltersToggleProps> = ({
  showAdvancedFilters,
  toggleAdvancedFilters
}) => {
  return (
    <button 
      onClick={toggleAdvancedFilters}
      className="flex items-center gap-2 py-1.5 px-3 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700"
    >
      <Filter className="h-4 w-4" />
      Advanced Filters
      <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
    </button>
  );
};
