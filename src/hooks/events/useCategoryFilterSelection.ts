import { useState, useCallback, useEffect } from 'react';

export const useCategoryFilterSelection = (
  allEventTypes: string[], 
  externalSelectedTypes: string[] = []
) => {
  // Internal state to track selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(externalSelectedTypes);
  
  // Sync with external selected types when they change
  useEffect(() => {
    // Only update if the arrays are actually different to prevent loops
    if (
      externalSelectedTypes.length !== selectedCategories.length || 
      externalSelectedTypes.some(type => !selectedCategories.includes(type))
    ) {
      setSelectedCategories(externalSelectedTypes);
    }
  }, [externalSelectedTypes]);

  // Select all event types
  const selectAll = useCallback(() => {
    setSelectedCategories([...allEventTypes]);
  }, [allEventTypes]);

  // Deselect all event types (empty array)
  const deselectAll = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Toggle a specific event type
  const toggleCategory = useCallback((type: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(type)) {
        // If removing the last category, select all instead
        if (prev.length === 1) {
          return [...allEventTypes];
        }
        // Otherwise, remove this category
        return prev.filter(t => t !== type);
      } else {
        // Add the category
        return [...prev, type];
      }
    });
  }, [allEventTypes]);

  // Check if no categories are selected
  const isNoneSelected = selectedCategories.length === 0;

  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected
  };
};
