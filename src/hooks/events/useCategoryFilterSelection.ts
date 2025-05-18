
import { useState } from 'react';

export const useCategoryFilterSelection = (allCategories: string[] = []) => {
  // Initialize with all categories selected by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const selectAll = () => {
    setSelectedCategories([...allCategories]);
  };

  const deselectAll = () => {
    setSelectedCategories([]);
  };

  // Reset function - goes back to all categories selected
  const reset = () => {
    selectAll();
  };

  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset
  };
};
