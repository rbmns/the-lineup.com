
import { useState, useEffect, useRef } from 'react';

// Storage key for persisting filter state
const FILTER_STORAGE_KEY = 'event-category-filters';

export const useCategoryFilterSelection = (categories: string[]) => {
  // Initialize with stored categories if available, otherwise use all categories
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
        if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
          // Ensure all categories from URL exist in the current categories list
          const validCategories = parsedCategories.filter(cat => categories.includes(cat));
          if (validCategories.length > 0) {
            setSelectedCategories(validCategories);
          }
        }
      } catch (e) {
        console.error("Error parsing URL categories:", e);
      }
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
        
        if (selectedCategories.length === categories.length) {
          // If all are selected, don't include in URL
          urlParams.delete('eventTypes');
        } else if (selectedCategories.length > 0) {
          // If some are selected, include them in URL
          urlParams.set('eventTypes', encodeURIComponent(JSON.stringify(selectedCategories)));
        } else {
          // If none are selected, clear this parameter
          urlParams.delete('eventTypes');
        }
        
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {
      console.error("Error saving category filters:", e);
    }
  }, [selectedCategories, categories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      // If all categories are currently selected and user clicks one,
      // show only that one category
      if (prev.length === categories.length) {
        return [category];
      }
      
      // If the category is already in the selection, remove it
      if (prev.includes(category)) {
        // Don't allow removing the last category (always keep at least one)
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter(c => c !== category);
      }
      
      // Otherwise, add the category to the selection
      return [...prev, category];
    });
  };

  const selectAll = () => {
    setSelectedCategories([...categories]);
  };

  const deselectAll = () => {
    // Allow deselecting all categories (showing no results)
    setSelectedCategories([]);
  };

  const reset = () => {
    setSelectedCategories([...categories]);
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
