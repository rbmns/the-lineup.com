
import { useState, useEffect } from 'react';

export const useCategoryFilterSelection = (
  allEventTypes: string[], 
  externalSelectedTypes?: string[]
) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    // Use external types if provided
    if (externalSelectedTypes && externalSelectedTypes.length > 0) {
      console.log('Using external selected types:', externalSelectedTypes);
      return externalSelectedTypes;
    }
    
    // Default to all event types if available
    if (allEventTypes.length > 0) {
      console.log('Selecting all event types by default:', allEventTypes);
      return [...allEventTypes];
    }
    
    return [];
  });
  
  // Update selectedCategories when externalSelectedTypes changes
  useEffect(() => {
    if (externalSelectedTypes && externalSelectedTypes.length > 0) {
      // Only update if there's an actual difference to prevent loops
      const sameSelection = 
        externalSelectedTypes.length === selectedCategories.length && 
        externalSelectedTypes.every(type => selectedCategories.includes(type));
      
      if (!sameSelection) {
        console.log('Updating selected categories from external types:', externalSelectedTypes);
        setSelectedCategories(externalSelectedTypes);
      }
    } else if (allEventTypes.length > 0 && selectedCategories.length === 0) {
      // If we have event types but none selected, select all by default
      console.log('No categories selected, selecting all event types');
      setSelectedCategories([...allEventTypes]);
    }
  }, [externalSelectedTypes, allEventTypes, selectedCategories]);
  
  const toggleCategory = (type: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const selectAll = () => {
    if (allEventTypes.length > 0) {
      setSelectedCategories([...allEventTypes]);
    }
  };
  
  const deselectAll = () => {
    setSelectedCategories([]);
  };
  
  const isNoneSelected = selectedCategories.length === 0;
  
  return {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected
  };
};
