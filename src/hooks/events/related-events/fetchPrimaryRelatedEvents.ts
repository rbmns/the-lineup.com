
import { Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { applyRsvpStatus } from './relatedEventsUtils';

/**
 * Fetches primary related events that match the same event type
 */
export const fetchPrimaryRelatedEvents = async (
  eventType: string,
  currentEventId: string,
  userId?: string,
  startDate?: string
): Promise<Event[]> => {
  try {
    // Get current date to filter out past events if no startDate is provided
    const filterDate = startDate || new Date().toISOString().split('T')[0];
    
    // Fetch events with the same event type
    const query = supabase.from('events').select(`
      *,
      creator:profiles(id, username, avatar_url, email, location, status),
      venues:venue_id(*)
    `)
    .eq('event_type', eventType)
    .neq('id', currentEventId)
    .gte('start_date', filterDate) // Only future events
    .order('start_time', { ascending: true })
    .limit(8);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching primary related events:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Apply RSVP status and correct attendees structure
    return await applyRsvpStatus(data, userId);
  } catch (error) {
    console.error('Error in fetchPrimaryRelatedEvents:', error);
    return [];
  }
};
