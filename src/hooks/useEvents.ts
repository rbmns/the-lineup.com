
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
        console.log('🔍 Fetching events for user:', userId, 'with options:', options);
        
        // Build the query with explicit venue join
        let query = supabase
          .from('events')
          .select(`
            *,
            venues:venue_id(
              id,
              name,
              street,
              postal_code,
              city,
              website,
              google_maps,
              region,
              tags
            ),
            event_rsvps(id, user_id, status)
          `)
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });

        // Apply status filter - only show published events unless explicitly requesting all statuses
        if (!options.includeAllStatuses) {
          console.log('🔍 Filtering to published events only');
          query = query.eq('status', 'published');
        } else {
          console.log('🔍 Including all event statuses');
        }
        
        const { data: eventsData, error } = await query;
        
        if (error) {
          console.error('❌ Error fetching events:', error);
          throw error;
        }

        console.log('📊 Raw events data from database:', eventsData?.length || 0, 'events');

        if (!eventsData) {
          console.log('⚠️ No data returned from query');
          return [];
        }
        
        // Debug: Let's see what statuses we have in the database
        if (eventsData.length > 0) {
          const statusCounts = eventsData.reduce((acc, event) => {
            acc[event.status || 'null'] = (acc[event.status || 'null'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          console.log('📊 Event status distribution:', statusCounts);
        }
        
        // Now fetch creator profiles separately to avoid the foreign key conflict
        const creatorIds = eventsData.map(event => event.creator).filter(Boolean);
        
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
        const eventsWithCreators = eventsData.map(event => ({
          ...event,
          creator: creatorsData.find(creator => creator.id === event.creator) || null
        }));
        
        // Process the events data
        const processedEvents = processEventsData(eventsWithCreators, userId);
        console.log('🔄 Processed events:', processedEvents?.length || 0);
        
        if (options.includePastEvents) {
          console.log(`✅ Returning all events (including past): ${processedEvents.length}`);
          return processedEvents;
        }
        
        // Apply time-based filtering to only show upcoming events
        const filteredEvents = filterUpcomingEvents(processedEvents);
        
        console.log(`📅 Events after time filtering: ${filteredEvents.length} (from ${processedEvents.length} total)`);
        
        return filteredEvents;
      } catch (error) {
        console.error('💥 Error in useEvents:', error);
        return [];
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 10, // Reduced stale time to 10 seconds for more frequent updates
  });

  console.log('🎯 useEvents hook result:', { 
    dataLength: data?.length || 0, 
    isLoading, 
    hasError: !!error,
    errorMessage: error?.message
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch
  };
};
