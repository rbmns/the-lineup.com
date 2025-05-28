
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
            user_id,
            profiles!event_rsvps_user_id_fkey(
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
            user_id,
            profiles!event_rsvps_user_id_fkey(
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
            )
          `)
          .eq('event_id', eventId)
          .eq('status', 'Interested');

        if (interestedError) {
          console.error('Error fetching interested attendees:', interestedError);
        }

        // Process the data correctly - handle both single object and array cases
        const goingAttendees: EventAttendee[] = (goingData || [])
          .filter(item => item.profiles)
          .map(item => {
            // Handle case where profiles might be an array (take first item) or single object
            const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
            if (!profile) return null;
            
            return {
              id: profile.id,
              username: profile.username,
              avatar_url: profile.avatar_url,
              email: profile.email,
              location: profile.location,
              location_category: profile.location_category,
              status: profile.status,
              status_details: profile.status_details,
              tagline: profile.tagline,
              created_at: profile.created_at,
              updated_at: profile.updated_at,
              rsvp_status: 'Going' as const
            };
          })
          .filter((item): item is EventAttendee => item !== null);

        const interestedAttendees: EventAttendee[] = (interestedData || [])
          .filter(item => item.profiles)
          .map(item => {
            // Handle case where profiles might be an array (take first item) or single object
            const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
            if (!profile) return null;
            
            return {
              id: profile.id,
              username: profile.username,
              avatar_url: profile.avatar_url,
              email: profile.email,
              location: profile.location,
              location_category: profile.location_category,
              status: profile.status,
              status_details: profile.status_details,
              tagline: profile.tagline,
              created_at: profile.created_at,
              updated_at: profile.updated_at,
              rsvp_status: 'Interested' as const
            };
          })
          .filter(Boolean) as EventAttendee[];

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
