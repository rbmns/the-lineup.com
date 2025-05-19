import { useState, useEffect } from 'react';

export const useCategoryFilterSelection = (allCategories: string[]) => {
  // Start with all categories selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Initialize with all categories selected when they become available
  useEffect(() => {
    if (allCategories?.length > 0) {
      setSelectedCategories([...allCategories]);
    }
  }, [allCategories]);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      // If this was the only selected category, clicking it will deselect all
      if (prev.includes(category) && prev.length === 1) {
        return [];
      }
      
      // If this category is already selected, remove it
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      }
      
      // If no categories are currently selected, this becomes the only one
      if (prev.length === 0) {
        return [category];
      }
      
      // Otherwise, add this category to the existing selection (OR logic)
      return [...prev, category];
    });
  };
  
  const selectAll = () => {
    setSelectedCategories([...allCategories]);
  };
  
  const deselectAll = () => {
    setSelectedCategories([]);
  };
  
  const isAllSelected = selectedCategories.length === allCategories.length && allCategories.length > 0;
  const isNoneSelected = selectedCategories.length === 0;
  
  return {
    selectedCategories,
    setSelectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isAllSelected,
    isNoneSelected
  };
};
