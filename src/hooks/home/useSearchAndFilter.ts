
import { useCallback } from 'react';
import { processEventData } from './useEventDataProcessor';
import { useSearchTracking } from './useSearchTracking';
import { useSimilarResults } from './useSimilarResults';
import { useQueryOnlyResults } from './useQueryOnlyResults';
import { useAISearch } from './useAISearch';
import { useCategoryFilter } from './useCategoryFilter';

export const useSearchAndFilter = (
  userId: string | undefined,
  setSearchResults: (results: any[] | null) => void,
  setQueryOnlyResults: (results: any[] | null) => void,
  setSimilarEvents: (results: any[]) => void,
  setNoResultsFound: (value: boolean) => void,
  setIsSearching: (value: boolean) => void,
  setAiSearchFilter: (filter: any) => void,
  setAiFeedback: (feedback: string | undefined) => void,
  selectedEventTypes: string[],
  setSelectedEventTypes: (types: string[]) => void,
  setIsAiSearching: (value: boolean) => void
) => {
  // Import functionality from sub-hooks
  const { trackSearch } = useSearchTracking(userId);
  
  const { fetchQueryOnlyResults } = useQueryOnlyResults(setQueryOnlyResults);
  
  const { fetchSimilarResults } = useSimilarResults(
    setSelectedEventTypes,
    setSimilarEvents
  );
  
  const { handleAiSearch } = useAISearch(
    userId,
    setSearchResults,
    setNoResultsFound,
    setIsSearching,
    setAiSearchFilter,
    setAiFeedback,
    setSelectedEventTypes,
    setIsAiSearching,
    fetchQueryOnlyResults,
    fetchSimilarResults
  );
  
  const { handleCategoryFilter } = useCategoryFilter(
    setSearchResults,
    setQueryOnlyResults,
    setNoResultsFound,
    setIsSearching,
    setAiFeedback,
    fetchSimilarResults,
    fetchQueryOnlyResults
  );

  // Submit search form
  const handleSearch = useCallback(async (e?: React.FormEvent, query?: string) => {
    if (e) e.preventDefault();
    
    // Use the passed query parameter
    if (query) {
      await handleAiSearch(query);
    }
  }, [handleAiSearch]);

  return {
    handleAiSearch,
    fetchQueryOnlyResults,
    fetchSimilarResults,
    handleCategoryFilter: (searchQuery?: string) => handleCategoryFilter(selectedEventTypes, searchQuery),
    handleSearch,
    processEventData,
    trackSearch
  };
};
