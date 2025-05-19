
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { filterUpcomingEvents } from '@/utils/dateUtils';

export const useSearchResultsState = (events: Event[] | undefined) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[] | null>(null);
  const [combinedResults, setCombinedResults] = useState<Event[] | null>(null);
  const [queryOnlyResults, setQueryOnlyResults] = useState<Event[] | null>(null);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [aiSearchFilter, setAiSearchFilter] = useState<{
    categories?: string[], 
    location?: string, 
    date_range?: string,
    feedback?: string
  } | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | undefined>(undefined);

  // Extract available categories from events
  useEffect(() => {
    if (events && events.length > 0) {
      const categories = [...new Set(events.map(event => event.event_type).filter(Boolean))];
      setAvailableCategories(categories);
    }
  }, [events]);

  // Update combined results when search results or query-only results change
  useEffect(() => {
    if (searchResults && queryOnlyResults) {
      const combinedMap = new Map();
      
      searchResults.forEach(event => combinedMap.set(event.id, event));
      
      queryOnlyResults.forEach(event => {
        if (!combinedMap.has(event.id)) {
          combinedMap.set(event.id, { ...event, isQueryOnly: true });
        }
      });
      
      const combined = Array.from(combinedMap.values());
      setCombinedResults(combined);
    } else if (searchResults) {
      setCombinedResults(searchResults);
    } else if (queryOnlyResults) {
      setCombinedResults(queryOnlyResults);
    } else {
      setCombinedResults(null);
    }
  }, [searchResults, queryOnlyResults]);

  // Update AI search filter categories
  useEffect(() => {
    if (aiSearchFilter && aiSearchFilter.categories && aiSearchFilter.categories.length > 0) {
      setSelectedEventTypes(aiSearchFilter.categories);
    }
  }, [aiSearchFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedEventTypes([]);
    setSearchResults(null);
    setCombinedResults(null);
    setQueryOnlyResults(null);
    setSimilarEvents([]);
    setNoResultsFound(false);
    setAiFeedback(undefined);
    setAiSearchFilter(null);
  };

  const toggleEventType = (eventType: string) => {
    setSelectedEventTypes(prev => {
      if (prev.includes(eventType)) {
        return prev.filter(type => type !== eventType);
      }
      return [...prev, eventType];
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    combinedResults,
    setCombinedResults,
    queryOnlyResults,
    setQueryOnlyResults,
    selectedEventTypes,
    setSelectedEventTypes,
    isSearching,
    setIsSearching,
    isLocalLoading,
    setIsLocalLoading,
    availableCategories,
    similarEvents,
    setSimilarEvents,
    noResultsFound,
    setNoResultsFound,
    aiSearchFilter,
    setAiSearchFilter,
    isAiSearching,
    setIsAiSearching,
    aiFeedback,
    setAiFeedback,
    resetFilters,
    toggleEventType
  };
};
