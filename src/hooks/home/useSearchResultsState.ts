
import { useEffect } from 'react';
import { Event } from '@/types';
import { useEventCategories } from './useEventCategories';
import { useSearchState } from './useSearchState';
import { useFilterState } from './useFilterState';
import { useSimilarEventsState } from './useSimilarEventsState';
import { useCombinedResults } from './useCombinedResults';

export const useSearchResultsState = (events: Event[] | undefined) => {
  const eventCategories = useEventCategories(events);
  const searchState = useSearchState();
  const filterState = useFilterState();
  const similarEventsState = useSimilarEventsState();
  const combinedResultsState = useCombinedResults(
    searchState.searchResults,
    searchState.queryOnlyResults
  );

  // Update AI search filter categories
  useEffect(() => {
    if (filterState.aiSearchFilter && 
        filterState.aiSearchFilter.categories && 
        filterState.aiSearchFilter.categories.length > 0) {
      filterState.setSelectedEventTypes(filterState.aiSearchFilter.categories);
    }
  }, [filterState.aiSearchFilter]);

  const resetFilters = () => {
    searchState.resetSearch();
    filterState.resetFilters();
    similarEventsState.resetSimilarEvents();
    searchState.setNoResultsFound(false);
  };

  return {
    // Search state
    searchQuery: searchState.searchQuery,
    setSearchQuery: searchState.setSearchQuery,
    searchResults: searchState.searchResults,
    setSearchResults: searchState.setSearchResults,
    combinedResults: combinedResultsState.combinedResults,
    setCombinedResults: combinedResultsState.setCombinedResults,
    queryOnlyResults: searchState.queryOnlyResults,
    setQueryOnlyResults: searchState.setQueryOnlyResults,
    isSearching: searchState.isSearching,
    setIsSearching: searchState.setIsSearching,
    isLocalLoading: searchState.isLocalLoading,
    setIsLocalLoading: searchState.setIsLocalLoading,
    noResultsFound: searchState.noResultsFound,
    setNoResultsFound: searchState.setNoResultsFound,
    aiFeedback: searchState.aiFeedback,
    setAiFeedback: searchState.setAiFeedback,
    isAiSearching: searchState.isAiSearching,
    setIsAiSearching: searchState.setIsAiSearching,

    // Filter state
    selectedEventTypes: filterState.selectedEventTypes,
    setSelectedEventTypes: filterState.setSelectedEventTypes,
    aiSearchFilter: filterState.aiSearchFilter,
    setAiSearchFilter: filterState.setAiSearchFilter,
    toggleEventType: filterState.toggleEventType,

    // Categories
    availableCategories: eventCategories.availableCategories,

    // Similar events
    similarEvents: similarEventsState.similarEvents,
    setSimilarEvents: similarEventsState.setSimilarEvents,

    // Reset functions
    resetFilters
  };
};
