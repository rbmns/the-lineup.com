
import { useState, useEffect } from 'react';

/**
 * Hook to manage category filter selection state
 * @param availableCategories Array of available category strings
 * @returns Methods and state for category selection
 */
export const useCategoryFilterSelection = (availableCategories: string[] = []) => {
  // Initialize with all categories selected by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>(availableCategories);
  
  // Update selected categories when available categories change
  useEffect(() => {
    // Ensure all categories are selected by default
    setSelectedCategories(availableCategories);
  }, [availableCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      // If clicking a category when all are selected, select ONLY this category
      if (prev.length === availableCategories.length) {
        return [category];
      }
      
      // Normal toggle behavior
      if (prev.includes(category)) {
        // Allow deselecting even if it's the last category
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const selectAll = () => {
    setSelectedCategories([...availableCategories]);
  };

  const deselectAll = () => {
    // Now we allow completely empty selection
    setSelectedCategories([]);
  };

  const reset = () => {
    // Reset means select all categories (default state)
    setSelectedCategories([...availableCategories]);
  };

  return {
    selectedCategories,
    setSelectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset,
  };
};
