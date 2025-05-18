import { useState } from 'react';

export const useCategoryFilterSelection = (categories: string[]) => {
  // Initialize with all categories selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...categories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // If it's the only selected category, don't deselect it
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
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
