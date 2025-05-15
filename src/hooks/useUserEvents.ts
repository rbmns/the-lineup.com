
import React from 'react';
import { Event } from '@/types';
import { filterUpcomingEvents, filterPastEvents, sortEventsByDate } from '@/utils/dateUtils';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useUserEventQueries } from './useUserEventQueries';

export const useUserEvents = (
  userId: string | undefined, 
  currentUserId: string | undefined,
  friendshipStatus: 'none' | 'pending' | 'requested' | 'accepted'
) => {
  const { handleRsvp: handleRsvpAction } = useRsvpActions(currentUserId);
  
  // Consider all non-accepted statuses as 'none' for event queries
  const normalizedStatus = friendshipStatus === 'accepted' ? 'accepted' : 
                           friendshipStatus === 'pending' ? 'pending' : 'none';
                           
  const { userEvents, isLoading, refetch } = useUserEventQueries(userId, currentUserId, normalizedStatus);

  React.useEffect(() => {
    console.log('useUserEvents hook called with:', {
      userId,
      currentUserId,
      friendshipStatus,
      normalizedStatus
    });
  }, [userId, currentUserId, friendshipStatus, normalizedStatus]);

  // Use simple memoization to avoid unnecessary recalculations
  const upcomingEvents = React.useMemo(() => {
    return userEvents ? sortEventsByDate(filterUpcomingEvents(userEvents)) : [];
  }, [userEvents]);
  
  const pastEvents = React.useMemo(() => {
    return userEvents ? filterPastEvents(userEvents) : [];
  }, [userEvents]);

  // Handle RSVP actions
  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<void> => {
    if (handleRsvpAction) {
      await handleRsvpAction(eventId, status);
      if (refetch) {
        await refetch();
      }
    }
  };

  return {
    userEvents,
    isLoading,
    upcomingEvents,
    pastEvents,
    handleRsvp,
    refetch
  };
};
