
import { Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Apply RSVP status to events based on user's RSVPs
 */
export const applyRsvpStatus = async (
  events: any[], 
  userId?: string
): Promise<Event[]> => {
  if (!userId || events.length === 0) {
    // Return events with default attendees structure
    return events.map(event => ({
      ...event,
      attendees: {
        going: 0,
        interested: 0
      }
    }));
  }

  try {
    // Get all event IDs
    const eventIds = events.map(event => event.id);
    
    // Fetch RSVP status for these events for the current user
    const { data: rsvpData, error: rsvpError } = await supabase
      .from('event_rsvps')
      .select('event_id, status')
      .eq('user_id', userId)
      .in('event_id', eventIds);
      
    if (rsvpError) {
      console.error('Error fetching RSVP status:', rsvpError);
      return events.map(event => ({
        ...event,
        attendees: {
          going: 0,
          interested: 0
        }
      }));
    }
    
    // Create a map of event ID to RSVP status for quick lookup
    const rsvpMap = new Map();
    if (rsvpData) {
      rsvpData.forEach(rsvp => {
        rsvpMap.set(rsvp.event_id, rsvp.status);
      });
    }
    
    // Update the events with their RSVP status and proper attendees object
    return events.map(event => ({
      ...event,
      rsvp_status: rsvpMap.get(event.id) as 'Going' | 'Interested' | undefined,
      attendees: {
        going: 0,
        interested: 0
      }
    }));
  } catch (error) {
    console.error('Error applying RSVP status:', error);
    return events.map(event => ({
      ...event,
      attendees: {
        going: 0,
        interested: 0
      }
    }));
  }
};

/**
 * Sort events by matching tags
 */
export const sortEventsByTagMatch = (events: Event[], tags?: string[]): Event[] => {
  if (!tags || tags.length === 0) return events;

  return [...events].sort((a, b) => {
    const aTagsStr = Array.isArray(a.tags) ? a.tags.join(',') : String(a.tags || '');
    const bTagsStr = Array.isArray(b.tags) ? b.tags.join(',') : String(b.tags || '');
    
    const aMatchCount = tags.filter(tag => aTagsStr.includes(tag)).length;
    const bMatchCount = tags.filter(tag => bTagsStr.includes(tag)).length;
    
    // Sort by match count (descending)
    return bMatchCount - aMatchCount;
  });
};
