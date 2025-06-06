
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';

export const useEventDetails = (eventId: string | null) => {
  return useQuery({
    queryKey: ['event-details', eventId],
    queryFn: async (): Promise<Event | null> => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues (
            id,
            name,
            street,
            postal_code,
            city,
            website,
            google_maps
          ),
          profiles:creator (
            id,
            username,
            avatar_url,
            email,
            location,
            location_category,
            status,
            status_details,
            tagline,
            created_at,
            updated_at
          ),
          event_rsvps!left (
            status
          )
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
        throw error;
      }

      if (!data) return null;

      // Transform the data to match the Event type
      const transformedEvent: Event = {
        ...data,
        // Map creator profile properly
        creator: data.profiles || null,
        // Calculate attendees from event_rsvps
        attendees: {
          going: data.event_rsvps?.filter(rsvp => rsvp.status === 'Going').length || 0,
          interested: data.event_rsvps?.filter(rsvp => rsvp.status === 'Interested').length || 0,
        },
        // Map other required fields
        going_count: data.event_rsvps?.filter(rsvp => rsvp.status === 'Going').length || 0,
        interested_count: data.event_rsvps?.filter(rsvp => rsvp.status === 'Interested').length || 0,
      };

      return transformedEvent;
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
