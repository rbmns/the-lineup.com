import { useState, useCallback } from 'react';

export const useCategoryFilterSelection = (allCategories: string[] = []) => {
  // Initialize with all categories selected by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      // If the category is already in the selection and it's the only one selected,
      // revert to "all categories" by selecting all
      if (prev.includes(category) && prev.length === 1) {
        return [...allCategories];
      }
      
      // If the category is already in the selection but there are others selected too,
      // just remove this category from the selection
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } 
      
      // If the category is not in the selection and we're in "all categories" mode,
      // select only this category
      if (prev.length === allCategories.length || prev.length === 0) {
        return [category];
      }
      
      // Otherwise, add this category to the existing selection
      return [...prev, category];
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
