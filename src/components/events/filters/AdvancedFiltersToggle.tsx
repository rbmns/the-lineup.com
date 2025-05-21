
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedFiltersToggleProps {
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
}

export const AdvancedFiltersToggle: React.FC<AdvancedFiltersToggleProps> = ({
  showAdvancedFilters,
  toggleAdvancedFilters
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleAdvancedFilters}
      className="flex items-center justify-center w-9 h-9 p-0"
    >
      <Filter className="h-4 w-4" />
      <span className="sr-only">Advanced Filters</span>
      {showAdvancedFilters ? (
        <span className="sr-only">Hide filters</span>
      ) : (
        <span className="sr-only">Show filters</span>
      )}
    </Button>
  );
};
