
import { useState, useCallback } from 'react';

export const useEventLoadingState = () => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const startLoading = useCallback((eventId: string) => {
    setLoadingEventId(eventId);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingEventId(null);
  }, []);

  return {
    loadingEventId,
    isLoading: (eventId: string) => loadingEventId === eventId,
    startLoading,
    stopLoading
  };
};

export default useEventLoadingState;
