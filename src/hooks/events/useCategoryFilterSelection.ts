
import { useState } from 'react';

export const useCategoryFilterSelection = (categories: string[]) => {
  // Initialize with all categories selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...categories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      // If clicking on a category that's already selected and it's the only one selected
      // Don't deselect it (we always need at least one selected category)
      if (prev.includes(category) && prev.length === 1) {
        return prev;
      }
      
      // If clicking on a category that's not already selected,
      // make it the only selected category
      if (!prev.includes(category)) {
        return [category];
      }
      
      // If clicking on an already selected category and there are others selected,
      // deselect just this one
      return prev.filter(c => c !== category);
    });
  };

  const selectAll = () => {
    setSelectedCategories([...categories]);
  };

  const deselectAll = () => {
    // Keep at least one category selected
    if (categories.length > 0) {
      setSelectedCategories([categories[0]]);
    } else {
      setSelectedCategories([]);
    }
  };

  const reset = () => {
    setSelectedCategories([...categories]);
  };

  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset
  };
};
