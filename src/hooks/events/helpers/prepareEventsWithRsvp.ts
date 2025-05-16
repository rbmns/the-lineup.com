
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';

/**
 * Adds RSVP status to events for a given user
 */
export const prepareEventsWithRsvp = async (
  events: Event[],
  userId: string
): Promise<Event[]> => {
  if (!events?.length || !userId) {
    return events || [];
  }

  try {
    // Get event IDs
    const eventIds = events.map(event => event.id);

    // Fetch RSVP statuses
    const { data: rsvpData, error } = await supabase
      .from('rsvps')
      .select('event_id, status')
      .eq('user_id', userId)
      .in('event_id', eventIds);

    if (error) {
      console.error('Error fetching RSVPs:', error);
      return events;
    }

    // Create a map of event ID to RSVP status
    const rsvpMap: Record<string, 'Going' | 'Interested' | null> = {};
    
    if (rsvpData) {
      rsvpData.forEach(rsvp => {
        rsvpMap[rsvp.event_id] = rsvp.status === 'going' ? 'Going' : 
                                  rsvp.status === 'interested' ? 'Interested' : null;
      });
    }

    // Add RSVP status to each event
    return events.map(event => ({
      ...event,
      user_rsvp_status: rsvpMap[event.id] || null
    }));
  } catch (error) {
    console.error('Error preparing events with RSVP:', error);
    return events;
  }
};
