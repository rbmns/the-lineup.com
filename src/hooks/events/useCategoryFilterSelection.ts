
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useCategoryFilterSelection = (
  allCategories: string[],
  selectedEventTypes: string[]
) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(selectedEventTypes);
  const location = useLocation();
  const isInitialLoad = useRef(true);
  const lastSelectedTypes = useRef<string[]>([]);

  // Sync with URL parameters and provided selectedEventTypes
  useEffect(() => {
    // Prevent unnecessary updates by checking if the arrays are actually different
    if (allCategories.length > 0 && 
        JSON.stringify(selectedCategories) !== JSON.stringify(selectedEventTypes) &&
        JSON.stringify(lastSelectedTypes.current) !== JSON.stringify(selectedEventTypes)) {
      
      console.log('Updating selected categories from selectedEventTypes:', selectedEventTypes);
      lastSelectedTypes.current = [...selectedEventTypes];
      setSelectedCategories(selectedEventTypes);
    }
  }, [selectedEventTypes, allCategories.length, selectedCategories]);

  // Initialize from URL on first load
  useEffect(() => {
    if (isInitialLoad.current) {
      const searchParams = new URLSearchParams(location.search);
      const typesFromUrl = searchParams.getAll('type');
      
      if (typesFromUrl.length > 0 && selectedCategories.length === 0) {
        console.log('Setting categories from URL parameters:', typesFromUrl);
        setSelectedCategories(typesFromUrl);
        lastSelectedTypes.current = [...typesFromUrl];
      }
      isInitialLoad.current = false;
    }
  }, [location.search, selectedCategories.length]);

  // Toggle a category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      lastSelectedTypes.current = [...newSelection];
      return newSelection;
    });
  };

  // Select all categories
  const selectAll = () => {
    const newSelection = [...allCategories];
    lastSelectedTypes.current = newSelection;
    setSelectedCategories(newSelection);
  };

  // Deselect all categories
  const deselectAll = () => {
    lastSelectedTypes.current = [];
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
