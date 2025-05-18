
import { useState } from 'react';
import { useEventRsvp } from '../event-rsvp/useEventRsvp';

export const useEnhancedRsvp = (userId: string | undefined) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { handleRsvp } = useEventRsvp(userId);

  const handleEnhancedRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!userId) return false;
    
    setLoadingEventId(eventId);
    
    try {
      const result = await handleRsvp(eventId, status);
      return result;
    } finally {
      setTimeout(() => {
        setLoadingEventId(null);
      }, 300);
    }
  };

  return {
    handleRsvp: handleEnhancedRsvp,
    loadingEventId
  };
};
