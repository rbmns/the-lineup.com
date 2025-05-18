
import { useState } from 'react';
import { useCacheUpdater } from './useCacheUpdater';
import { useRsvpMutation } from './useRsvpMutation';

export const useRsvpActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { updateAllCaches } = useCacheUpdater();
  const { mutateRsvp } = useRsvpMutation();

  const handleRsvp = async (eventId: string, status: 'Interested' | 'Going'): Promise<boolean> => {
    if (!userId) {
      // Don't show toast, just return false
      console.log('User not logged in, cannot RSVP');
      return false;
    }

    console.log(`Handling RSVP: User ${userId}, Event ${eventId}, Status ${status}`);
    setLoading(true);
    
    try {
      // Perform the RSVP mutation and get results
      const { success, newStatus, oldStatus } = await mutateRsvp(userId, eventId, status);
      
      if (!success) {
        throw new Error('RSVP mutation failed');
      }
      
      // Update the cache directly
      updateAllCaches(eventId, userId, newStatus, oldStatus);
      
      return true;
    } catch (error) {
      console.error("Error RSVPing to event:", error);
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
