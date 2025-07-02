import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';

export const useMatchingRsvps = (currentUserId: string | undefined, friendUserId: string | undefined) => {
  const [matchingEvents, setMatchingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUserId || !friendUserId || currentUserId === friendUserId) {
      setMatchingEvents([]);
      return;
    }

    const fetchMatchingRsvps = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get events where both users have RSVPs
        const { data: matchingRsvps, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select(`
            event_id,
            status,
            events!inner (
              *,
              venues!left (*)
            )
          `)
          .eq('user_id', currentUserId);

        if (rsvpError) throw rsvpError;

        // Get friend's RSVPs
        const { data: friendRsvps, error: friendError } = await supabase
          .from('event_rsvps')
          .select('event_id, status')
          .eq('user_id', friendUserId);

        if (friendError) throw friendError;

        // Find matching event IDs
        const friendEventIds = new Set(friendRsvps?.map(r => r.event_id) || []);
        
        const matching = matchingRsvps
          ?.filter(rsvp => rsvp.events && friendEventIds.has(rsvp.event_id))
          .map(rsvp => ({
            ...(rsvp.events as any),
            rsvp_status: rsvp.status
          }))
          .filter(event => event && event.id) || [];

        setMatchingEvents(matching as Event[]);
      } catch (err) {
        console.error('Error fetching matching RSVPs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch matching events');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingRsvps();
  }, [currentUserId, friendUserId]);

  return { matchingEvents, loading, error };
};