
import { useState, useCallback } from 'react';

export const useCategoryFilterSelection = (allCategories: string[] = []) => {
  // Initialize with all categories selected by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
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
