
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { addDays, subDays, parseISO } from 'date-fns';

/**
 * Fetches primary related events based on the same event type and similar timeframe
 */
export const fetchPrimaryRelatedEvents = async (
  eventType: string,
  currentEventId: string,
  userId?: string,
  startDate?: string
): Promise<Event[]> => {
  if (!eventType || !currentEventId) {
    return [];
  }
  
  try {
    // Calculate date range around the event (within 7 days before and 14 days after)
    let dateFilter = {};
    if (startDate) {
      try {
        const eventDate = parseISO(startDate);
        const startRange = subDays(eventDate, 7).toISOString(); // 7 days before
        const endRange = addDays(eventDate, 14).toISOString();  // 14 days after
        
        dateFilter = {
          start_time: {
            gte: startRange,
            lte: endRange
          }
        };
      } catch (err) {
        console.error('Error parsing date for related events:', err);
      }
    }
    
    // Build the query to get events of the same type
    let query = supabase
      .from('events')
      .select(`
        *,
        venues:venue_id(*),
        creator:profiles(id, username, avatar_url),
        event_rsvps(user_id, status)
      `)
      .eq('event_type', eventType)
      .neq('id', currentEventId)
      .gt('start_time', new Date().toISOString());
      
    // Apply date range filter if available
    if (dateFilter) {
      // We can't directly pass the dateFilter object, so we need to use the Supabase filter methods
      console.log('Applying date filter for related events:', dateFilter);
      
      if (startDate) {
        const eventDate = parseISO(startDate);
        const startRange = subDays(eventDate, 7).toISOString();
        const endRange = addDays(eventDate, 14).toISOString();
        
        query = query
          .gte('start_time', startRange)
          .lte('start_time', endRange);
      }
    }
    
    // Execute the query
    const { data, error } = await query
      .order('start_time', { ascending: true })
      .limit(6);
      
    if (error) throw error;
    
    // Process the results into Event objects
    return (data || []).map(event => {
      // Determine RSVP status for the current user if available
      let rsvpStatus = undefined;
      if (userId && event.event_rsvps) {
        const userRsvp = event.event_rsvps.find((rsvp: any) => rsvp.user_id === userId);
        rsvpStatus = userRsvp ? userRsvp.status : undefined;
      }
      
      // Count attendees
      const going = event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0;
      const interested = event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0;
      
      return {
        ...event,
        rsvp_status: rsvpStatus,
        attendees: { going, interested }
      } as Event;
    });
  } catch (err) {
    console.error('Error fetching primary related events:', err);
    return [];
  }
};
