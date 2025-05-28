
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

interface EventAttendee extends UserProfile {
  rsvp_status: 'Going' | 'Interested';
}

export const useEventAttendees = (eventId: string) => {
  const [attendees, setAttendees] = useState<{
    going: EventAttendee[];
    interested: EventAttendee[];
  }>({
    going: [],
    interested: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch attendees with Going status
        const { data: goingData, error: goingError } = await supabase
          .from('event_rsvps')
          .select(`
            status,
            attendee_profile:profiles!event_rsvps_user_id_fkey(
              id,
              username,
              avatar_url,
              email,
              location,
              status,
              tagline,
              created_at,
              updated_at
            )
          `)
          .eq('event_id', eventId)
          .eq('status', 'Going');

        if (goingError) {
          console.error('Error fetching going attendees:', goingError);
        }

        // Fetch attendees with Interested status
        const { data: interestedData, error: interestedError } = await supabase
          .from('event_rsvps')
          .select(`
            status,
            attendee_profile:profiles!event_rsvps_user_id_fkey(
              id,
              username,
              avatar_url,
              email,
              location,
              status,
              tagline,
              created_at,
              updated_at
            )
          `)
          .eq('event_id', eventId)
          .eq('status', 'Interested');

        if (interestedError) {
          console.error('Error fetching interested attendees:', interestedError);
        }

        // Process the data
        const goingAttendees = goingData?.map(item => ({
          ...item.attendee_profile,
          rsvp_status: 'Going' as const
        })).filter(Boolean) || [];

        const interestedAttendees = interestedData?.map(item => ({
          ...item.attendee_profile,
          rsvp_status: 'Interested' as const
        })).filter(Boolean) || [];

        setAttendees({
          going: goingAttendees,
          interested: interestedAttendees
        });

      } catch (error) {
        console.error('Error fetching attendees:', error);
        setAttendees({ going: [], interested: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  return { attendees, loading };
};
