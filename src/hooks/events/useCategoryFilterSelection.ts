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
      // but ensure at least one category remains selected
      if (prev.includes(category)) {
        const filtered = prev.filter(c => c !== category);
        // If user is trying to deselect the last selected category,
        // don't allow it - keep the current selection
        return filtered.length > 0 ? filtered : prev;
      }
      
      // Otherwise, add the category to the selection
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
