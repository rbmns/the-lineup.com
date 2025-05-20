
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

    // Helper function to update events in a list with detailed logging
    const updateEventsInList = (events: any[], source: string = 'unknown') => {
      if (!events || !Array.isArray(events)) return events;
      
      let updated = false;
      const result = events.map(event => {
        if (event.id === eventId) {
          console.log(`Found event ${eventId} in cached list (source: ${source}), updating status to ${newStatus}`);
          updated = true;
          return { ...event, rsvp_status: newStatus };
        }
        return event;
      });
      
      if (!updated) {
        console.log(`Event ${eventId} not found in cache list (source: ${source})`);
      }
      
      return result;
    };

    // Update all events caches - both array format and object with data property
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      // Handle array format
      if (Array.isArray(oldData)) {
        return updateEventsInList(oldData, 'events-array');
      }
      
      // Handle object with data property (pagination)
      if (oldData && typeof oldData === 'object' && Array.isArray(oldData.data)) {
        return {
          ...oldData,
          data: updateEventsInList(oldData.data, 'events-pagination')
        };
      }
      
      return oldData;
    });

    // Update filtered-events cache with special attention to preserving filter state
    // This new implementation handles multiple formats and paths
    queryClient.setQueriesData({ queryKey: ['filtered-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      console.log(`Updating filtered-events cache, format: ${Array.isArray(oldData) ? 'array' : typeof oldData}`);
      
      if (Array.isArray(oldData)) {
        return updateEventsInList(oldData, 'filtered-events-array');
      }
      
      if (oldData && typeof oldData === 'object') {
        // Handle object format with data property
        if (Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: updateEventsInList(oldData.data, 'filtered-events-data')
          };
        }
        
        // Handle object format with events property
        if (Array.isArray(oldData.events)) {
          return {
            ...oldData,
            events: updateEventsInList(oldData.events, 'filtered-events-events')
          };
        }
        
        // Handle object with filters and results
        if (oldData.results && Array.isArray(oldData.results)) {
          return {
            ...oldData,
            results: updateEventsInList(oldData.results, 'filtered-events-results')
          };
        }
        
        // Handle format with eventsByCategory
        if (oldData.eventsByCategory && typeof oldData.eventsByCategory === 'object') {
          const updatedEventsByCategory = { ...oldData.eventsByCategory };
          
          // Update events in each category
          Object.keys(updatedEventsByCategory).forEach(category => {
            if (Array.isArray(updatedEventsByCategory[category])) {
              updatedEventsByCategory[category] = updateEventsInList(
                updatedEventsByCategory[category],
                `filtered-events-category-${category}`
              );
            }
          });
          
          return {
            ...oldData,
            eventsByCategory: updatedEventsByCategory
          };
        }
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
          upcomingEvents: updateEventsInList(oldData.upcomingEvents || [], 'userEvents-upcoming'),
          pastEvents: updateEventsInList(oldData.pastEvents || [], 'userEvents-past')
        };
      }
      
      return oldData;
    });

    // Special handling for event type filtered lists
    // This ensures that filtered event lists are also updated
    const filteredQueries = queryClient.getQueriesData({ queryKey: ['events', 'filtered'] });
    filteredQueries.forEach(([queryKey, data]: [any, any]) => {
      if (data) {
        console.log(`Found events-filtered cache for key: ${JSON.stringify(queryKey)}`);
        if (Array.isArray(data)) {
          queryClient.setQueryData(queryKey, updateEventsInList(data, 'events-filtered-array'));
        } else if (data.events && Array.isArray(data.events)) {
          queryClient.setQueryData(queryKey, {
            ...data,
            events: updateEventsInList(data.events, 'events-filtered-events')
          });
        } else if (data.data && Array.isArray(data.data)) {
          queryClient.setQueryData(queryKey, {
            ...data,
            data: updateEventsInList(data.data, 'events-filtered-data')
          });
        }
      }
    });
    
    // Handle other potential cache formats
    const queries = queryClient.getQueriesData({});
    queries.forEach(([queryKey, data]: [any, any]) => {
      const keyString = JSON.stringify(queryKey);
      // Check for any query key that might contain events but wasn't handled above
      if (
        keyString.includes('event') && 
        !keyString.includes(`"event","${eventId}"`) && // Skip the specific event we already updated
        !keyString.includes(`"events"`) && // Skip the events we already updated
        !keyString.includes(`"filtered-events"`) && // Skip filtered-events we already updated
        !keyString.includes(`"userEvents"`) && // Skip userEvents we already updated
        typeof data === 'object'
      ) {
        console.log(`Checking other cache key for events: ${keyString}`);
        
        // Handle paginated data or other nested structures
        if (data.data && Array.isArray(data.data)) {
          queryClient.setQueryData(queryKey, {
            ...data,
            data: updateEventsInList(data.data, `other-data-${keyString}`)
          });
        } else if (Array.isArray(data)) {
          queryClient.setQueryData(queryKey, updateEventsInList(data, `other-array-${keyString}`));
        } else if (data.events && Array.isArray(data.events)) {
          // Handle objects with events array
          queryClient.setQueryData(queryKey, {
            ...data,
            events: updateEventsInList(data.events, `other-events-${keyString}`)
          });
        } else if (data.results && Array.isArray(data.results)) {
          // Handle objects with results array
          queryClient.setQueryData(queryKey, {
            ...data,
            results: updateEventsInList(data.results, `other-results-${keyString}`)
          });
        }
      }
    });
    
    console.log(`Completed cache updates for event ${eventId}`);
  };

  return { updateAllCaches };
};
