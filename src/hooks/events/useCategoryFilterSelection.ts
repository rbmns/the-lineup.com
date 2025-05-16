import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useCategoryFilterSelection = (availableCategories: string[] = []) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Initialize with all categories selected (empty array means "all")
  useEffect(() => {
    if (availableCategories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories([...availableCategories]);
    }
  }, [availableCategories]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // If it was the last selected category, select all instead
        if (prev.length === 1) {
          toast({ title: "At least one category must be selected" });
          return availableCategories;
        }
        
        // Remove the category
        return prev.filter(c => c !== category);
      } else {
        // Add the category
        return [...prev, category];
      }
    });
  }, [availableCategories]);

  const selectAll = useCallback(() => {
    setSelectedCategories([...availableCategories]);
    toast({ title: "All categories selected" });
  }, [availableCategories]);

  const deselectAll = useCallback(() => {
    // Keep all (treat as showing all categories)
    setSelectedCategories([...availableCategories]);
    toast({ title: "All categories selected" });
  }, [availableCategories]);

  const reset = useCallback(() => {
    setSelectedCategories([...availableCategories]);
    toast({ title: "Categories reset to default" });
  }, [availableCategories]);

  return {
    selectedCategories,
    setSelectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    reset,
  };
};
