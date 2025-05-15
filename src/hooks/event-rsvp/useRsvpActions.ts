import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useCacheUpdater } from './useCacheUpdater';
import { useRsvpMutation } from './useRsvpMutation';

export const useRsvpActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { updateAllCaches } = useCacheUpdater();
  const { mutateRsvp } = useRsvpMutation();

  const handleRsvp = async (eventId: string, status: 'Interested' | 'Going') => {
    if (!userId) {
      // Keep this important authentication toast
      toast({
        description: "You need to be logged in to RSVP to events",
        variant: "destructive"
      });
      return false;
    }

    console.log(`Handling RSVP: User ${userId}, Event ${eventId}, Status ${status}`);
    setLoading(true);
    
    try {
      // Perform the RSVP mutation and get results
      const { success, newStatus, oldStatus, toastMessage } = await mutateRsvp(userId, eventId, status);
      
      if (!success) {
        throw new Error('RSVP mutation failed');
      }
      
      // Update the cache directly
      updateAllCaches(eventId, userId, newStatus, oldStatus);
      
      return true;
    } catch (error) {
      console.error("Error RSVPing to event:", error);
      // Keep this important error toast
      toast({
        description: "Failed to update RSVP status. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRsvp,
    loading
  };
};
