
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { fetchPrimaryRelatedEvents } from './fetchPrimaryRelatedEvents';

interface FetchOptions {
  eventType?: string;
  currentEventId?: string;
  limit?: number;
  minResults?: number;
  userId?: string;
  tags?: string[];
  startDate?: string;
}

/**
 * Fetches related events with proper error handling and fallbacks
 */
export const fetchRelatedEvents = async ({
  eventType,
  currentEventId,
  limit = 4,
  minResults = 2,
  userId,
  tags = [],
  startDate
}: FetchOptions): Promise<Event[]> => {
  try {
    // Try to get events with the same event type first
    let events = await fetchPrimaryRelatedEvents({
      eventType,
      currentEventId,
      limit,
      userId,
      tags,
      startDate
    });
    
    // If we don't have enough events, try to get events with similar tags
    if (events.length < minResults && tags && tags.length > 0) {
      const tagEvents = await fetchPrimaryRelatedEvents({
        currentEventId,
        limit: limit - events.length,
        userId,
        tags,
        startDate
      });
      
      // Add the tag events to our results, avoiding duplicates
      const eventIds = new Set(events.map(e => e.id));
      const uniqueTagEvents = tagEvents.filter(e => !eventIds.has(e.id));
      events = [...events, ...uniqueTagEvents];
    }
    
    // As a last resort, get any events if we still don't have enough
    if (events.length < minResults) {
      const fallbackEvents = await fetchPrimaryRelatedEvents({
        currentEventId,
        limit: limit - events.length,
        userId,
        startDate
      });
      
      // Add the fallback events to our results, avoiding duplicates
      const eventIds = new Set(events.map(e => e.id));
      const uniqueFallbackEvents = fallbackEvents.filter(e => !eventIds.has(e.id));
      events = [...events, ...uniqueFallbackEvents];
    }
    
    return events;
  } catch (error) {
    console.error('Error in fetchRelatedEvents:', error);
    return [];
  }
};
