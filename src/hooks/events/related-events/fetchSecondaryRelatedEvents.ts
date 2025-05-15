
import { Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { applyRsvpStatus, sortEventsByTagMatch } from './relatedEventsUtils';

/**
 * Fetches secondary related events when primary strategy doesn't yield enough results
 */
export const fetchSecondaryRelatedEvents = async (
  currentEventId: string,
  tags: string[] = [],
  userId?: string,
  startDate?: string
): Promise<Event[]> => {
  try {
    // Get current date to filter out past events if no startDate is provided
    const filterDate = startDate || new Date().toISOString().split('T')[0];
    
    // Fetch events regardless of type
    const fallbackQuery = supabase.from('events').select(`
      *,
      creator:profiles(id, username, avatar_url, email, location, status),
      venues:venue_id(*)
    `)
    .neq('id', currentEventId)
    .gte('start_date', filterDate) // Only future events
    .order('start_time', { ascending: true })
    .limit(10);
    
    const { data, error } = await fallbackQuery;
    
    if (error) {
      console.error('Error fetching secondary related events:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Apply RSVP status and correct attendees structure
    const eventsWithRsvp = await applyRsvpStatus(data, userId);
    
    // Sort by tag matches if we have tags
    if (tags.length > 0) {
      return sortEventsByTagMatch(eventsWithRsvp, tags);
    }
    
    return eventsWithRsvp;
  } catch (error) {
    console.error('Error in fetchSecondaryRelatedEvents:', error);
    return [];
  }
};
