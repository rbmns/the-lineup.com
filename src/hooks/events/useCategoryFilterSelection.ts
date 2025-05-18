
import { useState, useCallback } from 'react';

export const useCategoryFilterSelection = (allCategories: string[] = []) => {
  // Initialize with all categories selected by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      // If all categories are currently selected and user clicks one category
      // Only select that category (deselect all others)
      if (prev.length === allCategories.length) {
        return [category];
      }
      
      // If the category is already selected and it's the only one selected,
      // select all categories (reset to default state)
      if (prev.includes(category) && prev.length === 1) {
        return [...allCategories];
      }
      
      // If the category is already in the selection but there are others selected too,
      // just remove this category from the selection
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  }, [allCategories]);

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
