
import { useState, useEffect, useRef } from 'react';

// Storage key for persisting filter state
const FILTER_STORAGE_KEY = 'event-category-filters';

export const useCategoryFilterSelection = (categories: string[]) => {
  // Initialize with all categories if available, otherwise empty array
  const initialCategories = () => {
    try {
      const storedCategories = sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (storedCategories) {
        const parsed = JSON.parse(storedCategories);
        // Ensure all stored categories exist in the current categories list
        const validCategories = parsed.filter((cat: string) => categories.includes(cat));
        if (validCategories.length > 0) {
          return validCategories;
        }
      }
    } catch (e) {
      console.error("Error reading stored categories:", e);
    }
    // Default behavior: select ALL categories initially
    return [...categories];
  };

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const isInitialRender = useRef(true);

  // Handle URL parameters for filter preservation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategories = urlParams.get('eventTypes');
    
    if (urlCategories && isInitialRender.current) {
      try {
        const parsedCategories = JSON.parse(decodeURIComponent(urlCategories));
        if (Array.isArray(parsedCategories)) {
          // Ensure all categories from URL exist in the current categories list
          const validCategories = parsedCategories.filter(cat => categories.includes(cat));
          setSelectedCategories(validCategories);
        }
      } catch (e) {
        console.error("Error parsing URL categories:", e);
      }
    } else if (isInitialRender.current && !urlCategories) {
      // If no URL categories and first render, select all categories
      setSelectedCategories([...categories]);
    }
    
    isInitialRender.current = false;
  }, [categories]);

  // Save selected categories to sessionStorage and URL whenever they change
  useEffect(() => {
    if (isInitialRender.current) return;
    
    try {
      // Save to sessionStorage for persistence across page loads
      sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(selectedCategories));
      
      // Update URL parameters without triggering navigation
      if (window.location.pathname.includes('/events')) {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (selectedCategories.length === 0) {
          // If none are selected, don't include in URL (default state)
          urlParams.delete('eventTypes');
        } else {
          // If some are selected, include them in URL
          urlParams.set('eventTypes', encodeURIComponent(JSON.stringify(selectedCategories)));
        }
        
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {
      console.error("Error saving category filters:", e);
    }
  }, [selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // If the category is already selected, remove it
        return prev.filter(c => c !== category);
      } else {
        // Otherwise, add the category to the selection
        return [...prev, category];
      }
    });
  };

  const selectAll = () => {
    setSelectedCategories([...categories]);
  };

  const deselectAll = () => {
    setSelectedCategories([]);
  };

  const reset = () => {
    setSelectedCategories([...categories]);  // Reset to all categories
  };

  const isAllSelected = selectedCategories.length === categories.length;
  const isNoneSelected = selectedCategories.length === 0;

  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset,
    isAllSelected,
    isNoneSelected
  };
};
