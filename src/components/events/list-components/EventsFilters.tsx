
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EventsFiltersProps {
  categories: Array<{id: string, name: string}>;
  activeFilters: Record<string, boolean>;
  onFilterChange: (id: string) => void;
  onClearFilters: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

export const EventsFilters: React.FC<EventsFiltersProps> = ({
  categories,
  activeFilters,
  onFilterChange,
  onClearFilters,
  onSearchChange,
  searchQuery
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(active => active) || searchQuery;
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search events..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeFilters[category.id] ? "default" : "outline"}
            size="sm"
            className={activeFilters[category.id] 
              ? "bg-purple-600 hover:bg-purple-700" 
              : "text-gray-700 hover:text-gray-900"
            }
            onClick={() => onFilterChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-600 hover:text-gray-900"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default EventsFilters;
