
import { useState, useCallback } from 'react';

interface UseFiltersResult {
  activeFilters: Record<string, boolean>;
  setActiveFilters: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  hasActiveFilters: boolean;
  handleFilterChange: (filterId: string) => void;
  handleClearFilters: () => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

export const useFilters = (): UseFiltersResult => {
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const hasActiveFilters = Object.values(activeFilters).some(active => active) || 
    searchQuery.trim().length > 0;
  
  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  }, []);
  
  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery('');
  }, []);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);
  
  return {
    activeFilters,
    setActiveFilters,
    hasActiveFilters,
    handleFilterChange,
    handleClearFilters,
    handleSearchChange,
    searchQuery
  };
};

export default useFilters;
