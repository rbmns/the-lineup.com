
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useCategoryFilterSelection = (availableCategories: string[] = []) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Initialize with all categories selected
  useEffect(() => {
    if (availableCategories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories([...availableCategories]);
    }
  }, [availableCategories, selectedCategories.length]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // If this is the last selected category, don't allow deselecting it
        if (prev.length === 1) {
          toast({ title: "At least one category must be selected" });
          return prev;
        }
        // Remove the category
        return prev.filter(c => c !== category);
      } else {
        // Add the category
        return [...prev, category];
      }
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedCategories([...availableCategories]);
    toast({ title: "All categories selected" });
  }, [availableCategories]);

  const deselectAll = useCallback(() => {
    if (availableCategories.length > 0) {
      // Keep one category selected
      setSelectedCategories([availableCategories[0]]);
      toast({ title: "Showing only " + availableCategories[0] });
    }
  }, [availableCategories]);

  const reset = useCallback(() => {
    setSelectedCategories([...availableCategories]);
    toast({ title: "Filters reset to default" });
  }, [availableCategories]);

  // Add a new function to check if all categories are selected
  const areAllSelected = useCallback(() => {
    return availableCategories.length > 0 && 
           selectedCategories.length === availableCategories.length;
  }, [availableCategories, selectedCategories]);

  return {
    selectedCategories,
    setSelectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset,
    areAllSelected
  };
};
