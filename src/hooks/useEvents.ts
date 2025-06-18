
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { filterUpcomingEvents } from '@/utils/date-filtering';

export interface UseEventsResult {
  data: Event[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

export const useEvents = (
  userId: string | undefined = undefined, 
  options: { 
    includePastEvents?: boolean;
    includeAllStatuses?: boolean;
  } = {}
): UseEventsResult => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', userId, options],
    queryFn: async () => {
      try {
        console.log('Fetching events for user:', userId, 'with options:', options);
        
        // Build the query
        let query = supabase
          .from('events')
          .select(`
            *,
            venues!events_venue_id_fkey(*),
            event_rsvps(id, user_id, status)
          `)
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });

        // If not including all statuses (admin view), filter to published events only
        if (!options.includeAllStatuses) {
          query = query.eq('status', 'published');
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching events:', error);
          throw error;
        }

        if (!data) {
          return [];
        }
        
        // Now fetch creator profiles separately to avoid the foreign key conflict
        const eventIds = data.map(event => event.id);
        const creatorIds = data.map(event => event.creator).filter(Boolean);
        
        let creatorsData = [];
        if (creatorIds.length > 0) {
          const { data: creators, error: creatorsError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, email, location, status, tagline')
            .in('id', creatorIds);
            
          if (!creatorsError && creators) {
            creatorsData = creators;
          }
        }
        
        // Combine the data manually
        const eventsWithCreators = data.map(event => ({
          ...event,
          creator: creatorsData.find(creator => creator.id === event.creator) || null
        }));
        
        // Process the events data
        const processedEvents = processEventsData(eventsWithCreators, userId);
        
        if (options.includePastEvents) {
          console.log(`Total events fetched (including past): ${processedEvents.length}`);
          return processedEvents;
        }
        
        // Apply time-based filtering to only show upcoming events
        const filteredEvents = filterUpcomingEvents(processedEvents);
        
        console.log(`Total events fetched: ${processedEvents.length}`);
        console.log(`Filtered events after time filtering: ${filteredEvents.length}`);
        
        return filteredEvents;
      } catch (error) {
        console.error('Error in useEvents:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 10, // Reduced stale time to 10 seconds for more frequent updates
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch
  };
};
