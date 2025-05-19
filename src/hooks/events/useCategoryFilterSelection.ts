
import { useState } from 'react';

export const useCategoryFilterSelection = (categories: string[]) => {
  // Initialize with all categories selected (default state)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...categories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      // If all categories are currently selected and user clicks one,
      // show only that one category
      if (prev.length === categories.length) {
        return [category];
      }
      
      // If the category is already in the selection, remove it
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      
      // Otherwise, add the category to the selection
      return [...prev, category];
    });
  };

  const selectAll = () => {
    setSelectedCategories([...categories]);
  };

  const deselectAll = () => {
    // Allow deselecting all categories (showing no results)
    setSelectedCategories([]);
  };

  const reset = () => {
    setSelectedCategories([...categories]);
  };

  const isAllSelected = selectedCategories.length === categories.length;
  const isNoneSelected = selectedCategories.length === 0;

  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset,
    isAllSelected,
    isNoneSelected
  };
};
