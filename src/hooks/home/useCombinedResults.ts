
import { useState, useEffect } from 'react';
import { Event } from '@/types';

export const useCombinedResults = (
  searchResults: Event[] | null,
  queryOnlyResults: Event[] | null
) => {
  const [combinedResults, setCombinedResults] = useState<Event[] | null>(null);

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

  return {
    combinedResults,
    setCombinedResults
  };
};
