
import { useState } from 'react';

type EventCategory = string;
type Filter = {
  id: string;
  name: string;
  active: boolean;
};

export const useEventFilters = (initialCategories: EventCategory[] = []) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Convert string categories to filter objects
  // Sort the filters alphabetically by name
  const filters = initialCategories
    .map(cat => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      name: cat,
      active: activeFilters[cat.toLowerCase().replace(/\s+/g, '-')] || false
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };

  const selectCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  const resetFilters = () => {
    setActiveFilters({});
    setSelectedCategory(null);
  };

  const getActiveFilterIds = () => {
    return Object.entries(activeFilters)
      .filter(([_, active]) => active)
      .map(([id]) => id);
  };

  return {
    filters,
    activeFilters,
    selectedCategory,
    isFilterLoading: isFilterLoading,
    setIsFilterLoading,
    toggleFilter,
    selectCategory,
    resetFilters,
    getActiveFilterIds
  };
};
