
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AttendeesList {
  going: any[];
  interested: any[];
}

export const useEventAttendees = (eventId: string) => {
  const [attendees, setAttendees] = useState<AttendeesList>({ going: [], interested: [] });

  const fetchAttendees = async () => {
    try {
      const { data: goingData, error: goingError } = await supabase
        .from('event_rsvps')
        .select('user_id, profiles:user_id(*)')
        .eq('event_id', eventId)
        .eq('status', 'Going');
      
      const { data: interestedData, error: interestedError } = await supabase
        .from('event_rsvps')
        .select('user_id, profiles:user_id(*)')
        .eq('event_id', eventId)
        .eq('status', 'Interested');
      
      if (goingError || interestedError) {
        console.error('Error fetching attendees:', goingError || interestedError);
      } else {
        setAttendees({
          going: goingData?.map(item => item.profiles) || [],
          interested: interestedData?.map(item => item.profiles) || []
        });
      }
    } catch (err) {
      console.error('Error fetching attendees:', err);
    }
  };

  return { 
    attendees,
    fetchAttendees
  };
};
