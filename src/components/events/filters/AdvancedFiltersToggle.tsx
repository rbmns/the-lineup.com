
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
      className="flex items-center gap-2 text-sm"
    >
      <Filter className="h-4 w-4" />
      Advanced Filters
      {showAdvancedFilters ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
};
