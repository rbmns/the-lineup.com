
import { useState } from 'react';
import { Event } from '@/types';

export const useSearchState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[] | null>(null);
  const [queryOnlyResults, setQueryOnlyResults] = useState<Event[] | null>(null);
  const [combinedResults, setCombinedResults] = useState<Event[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | undefined>(undefined);

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setCombinedResults(null);
    setQueryOnlyResults(null);
    setNoResultsFound(false);
    setAiFeedback(undefined);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    queryOnlyResults,
    setQueryOnlyResults,
    combinedResults,
    setCombinedResults,
    isSearching,
    setIsSearching,
    isLocalLoading,
    setIsLocalLoading,
    noResultsFound,
    setNoResultsFound,
    isAiSearching,
    setIsAiSearching,
    aiFeedback,
    setAiFeedback,
    resetSearch
  };
};
