
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
        
        // Build the query with RSVP status if user is provided
        let query = supabase
          .from('events')
          .select(`
            *,
            venues!events_venue_id_fkey(*),
            event_rsvps!left(id, user_id, status)
          `)
          .order('start_datetime', { ascending: true }); // Use start_datetime instead of start_date and start_time

        // Apply status filter - only show published events unless explicitly requesting all statuses
        if (!options.includeAllStatuses) {
          console.log('🔍 Filtering to published events only');
          query = query.eq('status', 'published');
        } else {
          console.log('🔍 Including all event statuses');
        }

        // If user is provided, filter RSVPs to only include current user's RSVPs
        if (userId) {
          query = query.or(`user_id.eq.${userId},user_id.is.null`, { foreignTable: 'event_rsvps' });
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('❌ Error fetching events:', error);
          throw error;
        }

        console.log('📊 Raw events data from database:', data?.length || 0, 'events');

        if (!data) {
          console.log('⚠️ No data returned from query');
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
        
        // Combine the data manually and add RSVP status
        const eventsWithCreators = data.map(event => {
          // Find the user's RSVP status for this event
          const userRsvp = event.event_rsvps?.find((rsvp: any) => rsvp.user_id === userId);
          
          return {
            ...event,
            creator: creatorsData.find(creator => creator.id === event.creator) || null,
            rsvp_status: userRsvp?.status || null,
            // Remove the event_rsvps array to avoid confusion
            event_rsvps: undefined
          };
        });
        
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
