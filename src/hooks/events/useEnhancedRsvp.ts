
import { useState, useCallback } from 'react';
import { useOptimisticRsvp } from '@/hooks/event-rsvp/useOptimisticRsvp';
import { toast } from '@/hooks/use-toast';

/**
 * Enhanced RSVP handler that combines optimistic updates with better UI feedback
 */
export const useEnhancedRsvp = (userId: string | undefined) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { handleRsvp: optimisticRsvp, loading } = useOptimisticRsvp(userId);

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      toast({
        description: "Please sign in to RSVP to events"
      });
      return false;
    }

    try {
      // Set local loading state for this specific event
      setLoadingEventId(eventId);
      console.log(`EnhancedRsvp: Processing RSVP for event ${eventId} with status ${status}`);

      // Handle the RSVP with optimistic UI updates
      const result = await optimisticRsvp(eventId, status);
      
      if (result) {
        // Show minimal success toast for confirmation
        toast({
          description: status === 'Going' ? "You're going!" : "You're interested!"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error in enhanced RSVP handler:', error);
      return false;
    } finally {
      // Clear loading state after completion
      setLoadingEventId(null);
    }
  }, [userId, optimisticRsvp]);

  return {
    handleRsvp,
    loading,
    loadingEventId
  };
};
