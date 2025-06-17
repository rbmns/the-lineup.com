
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';

export const useEventDetails = (eventId: string | undefined, userId: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('events')
          .select(`
            *,
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .eq('id', eventId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching event:', fetchError);
          setError('Failed to load event details');
          return;
        }

        if (!data) {
          setError('Event not found');
          return;
        }

        // Fetch creator separately
        let creatorData = null;
        if (data.creator) {
          const { data: creator, error: creatorError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, email, location, status, tagline')
            .eq('id', data.creator)
            .single();
            
          if (!creatorError && creator) {
            creatorData = creator;
          }
        }
        
        // Combine event with creator data
        const eventWithCreator = {
          ...data,
          creator: creatorData
        };

        // Process the event data using the same utility function
        const processedEvents = processEventsData([eventWithCreator], userId);
        setEvent(processedEvents[0] || null);

      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, userId]);

  return { event, loading, error };
};
