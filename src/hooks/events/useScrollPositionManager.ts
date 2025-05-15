
import { useState, useCallback } from 'react';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export const useScrollPositionManager = () => {
  const { savePosition, restorePosition } = useScrollPosition();
  const [showEventTypeFilter, setShowEventTypeFilter] = useState(false);
  const [showVenueFilter, setShowVenueFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  const handleFilterWithScrollPreservation = useCallback((action: () => void) => {
    // Save scroll position before filter change
    const scrollPosition = savePosition();
    
    // Execute the filter action
    action();
    
    // Restore scroll position after filtering
    setTimeout(() => {
      restorePosition(scrollPosition);
    }, 100);
  }, [savePosition, restorePosition]);

  return {
    showEventTypeFilter,
    setShowEventTypeFilter,
    showVenueFilter,
    setShowVenueFilter,
    showDateFilter,
    setShowDateFilter,
    handleFilterWithScrollPreservation,
    savePosition,
    restorePosition
  };
};
