
import { useState, useCallback } from 'react';

export const useCategoryFilterSelection = (allCategories: string[] = []) => {
  // Initialize with all categories selected by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      // If category is already selected and is the only one selected, deselect it (showing no events)
      if (prev.includes(category) && prev.length === 1) {
        return [];
      }
      
      // If the category is already selected and multiple categories are selected, remove it
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } 
      
      // If the category is not selected, add it
      return [...prev, category];
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedCategories([...allCategories]);
  }, [allCategories]);

  const deselectAll = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  const reset = useCallback(() => {
    setSelectedCategories([...allCategories]);
  }, [allCategories]);

  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset
  };
};
