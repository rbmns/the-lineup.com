
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseEventRsvpHandlerProps {
  userId: string | undefined;
  refetchEvents: () => Promise<any>;
}

export const useEventRsvpHandler = ({ userId, refetchEvents }: UseEventRsvpHandlerProps) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      // Removed toast notification
      return false;
    }

    setLoadingEventId(eventId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));

      // Removed toast notification
      await refetchEvents();
      return true;
    } catch (error) {
      console.error("Error in RSVP handler:", error);
      // Removed toast notification
      return false;
    } finally {
      setLoadingEventId(null);
    }
  };

  return {
    loadingEventId,
    handleEventRsvp,
  };
};
