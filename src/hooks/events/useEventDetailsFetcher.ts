
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
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(*),
          venues:venue_id(*),
          event_rsvps!inner(id, user_id, status)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        // Maybe the event exists but user hasn't RSVP'd - try without inner join
        const { data: dataNoRsvp, error: errorNoRsvp } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(*),
            venues:venue_id(*)
          `)
          .eq('id', eventId)
          .single();
          
        if (errorNoRsvp) {
          console.error('Error fetching event details:', errorNoRsvp);
          setError('Failed to load event details.');
          setIsLoading(false);
          return;
        } else {
          // Successfully got event, but no RSVP
          console.log('Event data loaded (no RSVP):', dataNoRsvp);
          
          // If user is logged in, check for RSVP separately
          if (user) {
            const { data: rsvpData } = await supabase
              .from('event_rsvps')
              .select('status')
              .eq('event_id', eventId)
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (rsvpData) {
              // Add RSVP status to event data
              dataNoRsvp.rsvp_status = rsvpData.status;
              console.log(`Found RSVP status for event ${eventId}:`, rsvpData.status);
            }
          }
          
          setEvent(dataNoRsvp);
        }
      } else if (data) {
        console.log('Event data loaded with RSVP:', data);
        
        // Extract RSVP status for the current user
        if (user && data.event_rsvps && data.event_rsvps.length > 0) {
          const userRsvp = data.event_rsvps.find((rsvp: any) => rsvp.user_id === user.id);
          if (userRsvp) {
            data.rsvp_status = userRsvp.status;
            console.log(`Set RSVP status for event ${eventId}:`, data.rsvp_status);
          }
        }
        
        setEvent(data);
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
