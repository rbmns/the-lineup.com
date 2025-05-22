
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useCategoryFilterSelection = (
  allCategories: string[],
  selectedEventTypes: string[]
) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(selectedEventTypes);
  const location = useLocation();

  // Sync with URL parameters and provided selectedEventTypes
  useEffect(() => {
    // Only update if we have categories and the selected types changed
    if (allCategories.length > 0 && 
        JSON.stringify(selectedCategories) !== JSON.stringify(selectedEventTypes)) {
      console.log('Updating selected categories from selectedEventTypes:', selectedEventTypes);
      setSelectedCategories(selectedEventTypes);
    }
  }, [selectedEventTypes, allCategories.length, selectedCategories]);

  // Initialize from URL on first load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typesFromUrl = searchParams.getAll('type');
    
    if (typesFromUrl.length > 0 && selectedCategories.length === 0) {
      console.log('Setting categories from URL parameters:', typesFromUrl);
      setSelectedCategories(typesFromUrl);
    }
  }, [location.search, selectedCategories.length]);

  // Toggle a category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Select all categories
  const selectAll = () => {
    setSelectedCategories([...allCategories]);
  };

  // Deselect all categories
  const deselectAll = () => {
    setSelectedCategories([]);
  };

  // Check if no categories are selected
  const isNoneSelected = selectedCategories.length === 0;

  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected
  };
};
