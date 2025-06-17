
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface UseEventDetailsFetcherResult {
  event: Event | null;
  isLoading: boolean;
  error: Error | string | null;
  refreshData: () => Promise<void>;
}

export const useEventDetailsFetcher = (eventId: string): UseEventDetailsFetcherResult => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | string | null>(null);
  const { user } = useAuth();

  const fetchEventDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if eventId is valid before querying
      if (!eventId) {
        console.error('Error: Missing eventId parameter');
        setError('Event ID is missing');
        setIsLoading(false);
        return;
      }

      console.log(`Fetching event details for eventId=${eventId}, userId=${user?.id}`);
      
      // Fetch event without creator to avoid foreign key issues
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues!events_venue_id_fkey(*),
          event_rsvps(id, user_id, status)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details.');
        setIsLoading(false);
        return;
      }

      if (data) {
        console.log('Event data loaded:', data);
        
        // Fetch creator separately if needed
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
        
        // Extract RSVP status for the current user
        if (user && data.event_rsvps && data.event_rsvps.length > 0) {
          const userRsvp = data.event_rsvps.find((rsvp: any) => rsvp.user_id === user.id);
          if (userRsvp) {
            eventWithCreator.rsvp_status = userRsvp.status;
            console.log(`Set RSVP status for event ${eventId}:`, eventWithCreator.rsvp_status);
          }
        }
        
        setEvent(eventWithCreator);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      console.error('Unexpected error fetching event details:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const refreshData = async () => {
    await fetchEventDetails();
  };

  return {
    event,
    isLoading,
    error,
    refreshData
  };
};
