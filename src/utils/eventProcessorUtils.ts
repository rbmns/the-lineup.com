import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { combineDateAndTime, getEventDateTime, getEventEndDateTime } from '@/utils/event-date-utils';

/**
 * Processes raw event data from Supabase, adding calculated fields and handling edge cases.
 * @param {any[]} data - Raw event data from Supabase.
 * @param {string | undefined} userId - The ID of the current user, if available.
 * @returns {Event[]} - Processed event data.
 */
export const processEventsData = (data: any[], userId: string | undefined): Event[] => {
  if (!data) return [];
  
  return data.map(event => {
    // Ensure start_date is always populated
    let start_date = event.start_date || event.created_at;
    
    // If start_time is missing but end_time is present, use end_time
    if (!event.start_time && event.end_time) {
      event.start_time = event.end_time;
    }
    
    // If start_time is still missing, try to derive it from start_date
    if (!event.start_time && start_date) {
      event.start_time = start_date;
    }
    
    // If start_time is still missing, set it to created_at
    if (!event.start_time) {
      event.start_time = event.created_at;
    }
    
    // Ensure event has a valid ID
    const eventId = event.id || event.supabaseId || event.created_at;
    
    // Determine RSVP status
    let rsvp_status = null;
    if (userId && event.event_rsvps && event.event_rsvps.length > 0) {
      const rsvp = event.event_rsvps.find(rsvp => rsvp.user_id === userId);
      rsvp_status = rsvp ? rsvp.status : null;
    }
    
    // Construct the event URL
    let eventUrl = `/events/${eventId}`;
    if (event.slug) {
      eventUrl = `/events/${eventId}/${event.slug}`;
    }
    
    return {
      ...event,
      id: eventId,
      start_date: event.start_date || null,
      start_time: event.start_time || null,
      end_time: event.end_time || null,
      location: event.location || null,
      event_type: event.event_type || null,
      rsvp_status: rsvp_status,
      eventUrl: eventUrl,
      eventDateTime: getEventDateTime(event),
      eventEndDateTime: getEventEndDateTime(event),
      // creator: event.creator || null, // Already included in the main event object
      // venues: event.venues || null,   // Already included in the main event object
    } as Event;
  });
};
