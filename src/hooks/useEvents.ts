
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
          console.log('🔍 Filtering to published events only');
          query = query.eq('status', 'published');
        } else {
          console.log('🔍 Including all event statuses');
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('❌ Error fetching events:', error);
          throw error;
        }

        console.log('📊 Raw events data from database:', data?.length || 0, 'events');
        console.log('📊 Sample event statuses:', data?.slice(0, 3).map(e => ({ id: e.id, title: e.title, status: e.status })));

        if (!data) {
          console.log('⚠️ No data returned from query');
          return [];
        }
        
        // Debug: Let's see what statuses we have in the database
        if (data.length > 0) {
          const statusCounts = data.reduce((acc, event) => {
            acc[event.status || 'null'] = (acc[event.status || 'null'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          console.log('📊 Event status distribution:', statusCounts);
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
