
import { useState, useEffect } from 'react';

export const useCategoryFilterSelection = (allEventTypes: string[]) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Initialize with all categories selected
  useEffect(() => {
    if (allEventTypes.length > 0) {
      setSelectedCategories([...allEventTypes]);
    }
  }, [allEventTypes]);
  
  const toggleCategory = (category: string) => {
    // Check if all categories are currently selected
    const allSelected = selectedCategories.length === allEventTypes.length;
    
    if (allSelected) {
      // If all are selected, clicking one filter should select only that one
      setSelectedCategories([category]);
    } else {
      // For subsequent clicks, add or remove the category
      if (selectedCategories.includes(category)) {
        // Remove this category if it's already selected
        setSelectedCategories(prev => prev.filter(c => c !== category));
      } else {
        // Add this category if it's not selected
        setSelectedCategories(prev => [...prev, category]);
      }
    }
  };
  
  const selectAll = () => {
    setSelectedCategories([...allEventTypes]);
  };
  
  const deselectAll = () => {
    setSelectedCategories([]);
  };
  
  const isNoneSelected = selectedCategories.length === 0;
  const isAllSelected = selectedCategories.length === allEventTypes.length;
  
  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected,
    isAllSelected
  };
};
