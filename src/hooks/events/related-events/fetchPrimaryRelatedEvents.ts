
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { prepareEventsWithRsvp } from '../helpers/prepareEventsWithRsvp';

interface FetchOptions {
  eventType?: string;
  currentEventId?: string;
  limit?: number;
  minResults?: number;
  startDate?: string;
  userId?: string;
  tags?: string[];
}

/**
 * Fetches related events based on event type
 */
export const fetchPrimaryRelatedEvents = async ({
  eventType,
  currentEventId,
  limit = 3,
  minResults = 2,
  startDate,
  userId,
  tags = []
}: FetchOptions): Promise<Event[]> => {
  
  try {
    // Base query
    let query = supabase
      .from('events')
      .select('*, creator:profiles(*), venues(*)')
      .neq('id', currentEventId || '')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Filter by event type if provided
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    // Filter by tags if provided - using ilike for text columns
    if (tags && tags.length > 0 && tags[0]) {
      // For each tag, add an "ilike" filter
      tags.forEach(tag => {
        if (tag && tag.trim()) {
          // Use contains operator for text fields with tag values
          query = query.ilike('tags', `%${tag}%`);
        }
      });
    }
    
    // Filter by date if provided
    if (startDate) {
      query = query.gte('start_date', startDate);
    }
    
    const { data: events, error } = await query;
    
    if (error) {
      console.error('Error fetching primary related events:', error);
      return [];
    }
    
    if (!events?.length) {
      return [];
    }
    
    // If we have a user ID, get the RSVP status for each event
    if (userId) {
      return await prepareEventsWithRsvp(events, userId);
    }
    
    return events;
  } catch (error) {
    console.error('Error in fetchPrimaryRelatedEvents:', error);
    return [];
  }
};
