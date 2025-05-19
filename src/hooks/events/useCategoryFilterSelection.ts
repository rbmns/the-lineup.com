import { useState } from 'react';

export const useCategoryFilterSelection = (categories: string[]) => {
  // Initialize with all categories selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...categories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      // If clicking on a category that's not already selected,
      // toggle just this one
      if (!prev.includes(category)) {
        return [...prev, category];
      }
      
      // If clicking on an already selected category,
      // deselect just this one, but ensure at least one remains selected
      const filtered = prev.filter(c => c !== category);
      return filtered.length > 0 ? filtered : prev;
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
