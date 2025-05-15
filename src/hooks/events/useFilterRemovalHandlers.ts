
import { useCallback } from 'react';

export const useFilterRemovalHandlers = (
  setSelectedEventTypes: (types: string[] | ((prev: string[]) => string[])) => void,
  setSelectedVenues: (venues: string[] | ((prev: string[]) => string[])) => void,
  setDateRange: (range: any) => void,
  setSelectedDateFilter: (filter: string) => void
) => {
  const handleRemoveEventType = useCallback((type: string) => {
    setSelectedEventTypes(prev => prev.filter(t => t !== type));
  }, [setSelectedEventTypes]);
  
  const handleRemoveVenue = useCallback((venue: string) => {
    setSelectedVenues(prev => prev.filter(v => v !== venue));
  }, [setSelectedVenues]);
  
  const handleClearDateFilter = useCallback(() => {
    setDateRange(undefined);
    setSelectedDateFilter('');
  }, [setDateRange, setSelectedDateFilter]);
  
  return {
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter
  };
};
