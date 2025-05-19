import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Storage key for persisting filter state
const FILTER_STORAGE_KEY = 'event-category-filters';

export const useCategoryFilterSelection = (categories: string[]) => {
  const location = useLocation();
  
  // Initialize with all categories if available, otherwise empty array
  const initialCategories = () => {
    try {
      // Check location state first if coming from event detail
      if (location.state?.fromEventDetail && 
          location.state?.restoreFilters && 
          location.state?.filterState?.eventTypes) {
        const stateCategories = location.state.filterState.eventTypes;
        if (Array.isArray(stateCategories) && stateCategories.length > 0) {
          const validCategories = stateCategories.filter((cat: string) => categories.includes(cat));
          if (validCategories.length > 0) {
            console.log("Restored categories from navigation state:", validCategories);
            return validCategories;
          }
        }
      }
      
      // If navigating from a specific event type
      if (location.state?.filterByType) {
        const targetType = location.state.filterByType;
        if (typeof targetType === 'string' && categories.includes(targetType)) {
          return [targetType];
        }
      }
      
      // Then check sessionStorage
      const storedCategories = sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (storedCategories) {
        const parsed = JSON.parse(storedCategories);
        // Ensure all stored categories exist in the current categories list
        const validCategories = parsed.filter((cat: string) => categories.includes(cat));
        if (validCategories.length > 0) {
          console.log("Restored categories from session storage:", validCategories);
          return validCategories;
        }
      }
      
      // Check URL parameters
      const urlParams = new URLSearchParams(location.search);
      const eventTypesParam = urlParams.get('eventTypes');
      const typeParam = urlParams.get('type');
      
      if (eventTypesParam) {
        try {
          const parsedEventTypes = JSON.parse(decodeURIComponent(eventTypesParam));
          if (Array.isArray(parsedEventTypes) && parsedEventTypes.length > 0) {
            const validCategories = parsedEventTypes.filter(cat => categories.includes(cat));
            if (validCategories.length > 0) {
              console.log("Restored categories from URL eventTypes param:", validCategories);
              return validCategories;
            }
          }
        } catch (e) {
          console.error("Error parsing URL eventTypes:", e);
        }
      }
      
      // Check for singular type parameter
      if (typeParam && categories.includes(typeParam)) {
        console.log("Filtered by single type from URL:", typeParam);
        return [typeParam];
      }
    } catch (e) {
      console.error("Error reading stored categories:", e);
    }
    
    // Default behavior: select ALL categories initially
    return [...categories];
  };

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const isInitialRender = useRef(true);
  const previousCategories = useRef<string[]>([]);

  // Update URL parameters without navigation
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (location.pathname.includes('/events')) {
      try {
        // Save to sessionStorage for persistence across page loads
        sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(selectedCategories));
        
        // Update URL parameters without triggering navigation
        const urlParams = new URLSearchParams(location.search);
        
        // Always include parameters regardless of "all selected" state for better persistence
        urlParams.set('eventTypes', encodeURIComponent(JSON.stringify(selectedCategories)));
        
        const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
        
        console.log("Category filter state saved to URL and session storage:", selectedCategories);
      } catch (e) {
        console.error("Error saving category filters:", e);
      }
    }
  }, [selectedCategories, categories, location.pathname, location.search]);
  
  // Handle categories list changing (e.g. when events load)
  useEffect(() => {
    // Skip this on first render
    if (isInitialRender.current) {
      return;
    }
    
    // If categories have changed
    if (JSON.stringify(previousCategories.current) !== JSON.stringify(categories)) {
      // Only update if the current selection has invalid categories
      const validSelections = selectedCategories.filter(cat => categories.includes(cat));
      
      // If some selections are now invalid, update the state
      if (validSelections.length !== selectedCategories.length) {
        setSelectedCategories(validSelections.length > 0 ? validSelections : [...categories]);
      }
      
      previousCategories.current = [...categories];
    }
  }, [categories, selectedCategories]);
  
  // Save current categories list
  useEffect(() => {
    previousCategories.current = [...categories];
  }, [categories]);

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
