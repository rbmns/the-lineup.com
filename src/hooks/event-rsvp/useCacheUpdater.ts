
import { useQueryClient } from '@tanstack/react-query';

export const useCacheUpdater = () => {
  const queryClient = useQueryClient();

  /**
   * Updates all relevant caches with the new RSVP status without invalidating queries
   */
  const updateAllCaches = (
    eventId: string, 
    userId: string | undefined, 
    newStatus: 'Going' | 'Interested' | null, 
    oldStatus?: 'Going' | 'Interested' | null
  ) => {
    console.log(`Surgical cache update for event ${eventId}: ${oldStatus} → ${newStatus}`);

    // Update specific event in event detail cache
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      return { ...oldData, rsvp_status: newStatus };
    });

    // Helper function to update events in a list
    const updateEventsInList = (events: any[]) => {
      if (!events || !Array.isArray(events)) return events;
      
      return events.map(event => {
        if (event.id === eventId) {
          return { ...event, rsvp_status: newStatus };
        }
        return event;
      });
    };

    // Update all events caches
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      if (Array.isArray(oldData)) {
        return updateEventsInList(oldData);
      }
      return oldData;
    });

    // Update filtered-events cache
    queryClient.setQueriesData({ queryKey: ['filtered-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      if (Array.isArray(oldData)) {
        return updateEventsInList(oldData);
      }
      return oldData;
    });

    // Update user-events cache
    queryClient.setQueriesData({ queryKey: ['userEvents'] }, (oldData: any) => {
      if (!oldData) return oldData;

      // Handle the specific structure of userEvents data
      if (oldData.upcomingEvents || oldData.pastEvents) {
        return {
          ...oldData,
          upcomingEvents: updateEventsInList(oldData.upcomingEvents || []),
          pastEvents: updateEventsInList(oldData.pastEvents || [])
        };
      }
      
      return oldData;
    });

    // Handle other potential cache formats
    const queries = queryClient.getQueriesData({});
    queries.forEach(([queryKey, data]: [any, any]) => {
      const keyString = JSON.stringify(queryKey);
      if (
        keyString.includes('event') && 
        !keyString.includes(`"event","${eventId}"`) && // Skip the specific event we already updated
        typeof data === 'object'
      ) {
        // Handle paginated data or other nested structures
        if (data.data && Array.isArray(data.data)) {
          queryClient.setQueryData(queryKey, {
            ...data,
            data: updateEventsInList(data.data)
          });
        } else if (Array.isArray(data)) {
          queryClient.setQueryData(queryKey, updateEventsInList(data));
        }
      }
    });
  };

  return { updateAllCaches };
};
