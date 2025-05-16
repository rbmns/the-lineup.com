
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';

export interface FetchRelatedEventsProps {
  eventType: string;
  currentEventId: string;
  userId?: string;
  tags?: string[];
  startDate?: string;
  minResults?: number;
}

export async function fetchRelatedEvents({
  eventType,
  currentEventId,
  userId,
  tags = [],
  startDate,
  minResults = 2
}: FetchRelatedEventsProps): Promise<Event[]> {
  try {
    // Get current date to filter out past events
    const today = startDate || new Date().toISOString().split('T')[0];
    
    // First strategy: Fetch events with the same event type
    let query = supabase
      .from('events')
      .select(`
        *,
        creator:profiles(*),
        venues:venue_id(*)
      `)
      .eq('event_type', eventType)
      .neq('id', currentEventId)
      .gte('start_date', today)
      .order('start_date', { ascending: true })
      .limit(8);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching related events:', error);
      return [];
    }
    
    // Process the events data with user RSVP info
    const processedEvents = data ? processEventsData(data, userId) : [];
    
    // If we don't have enough events from the first strategy, try more fallbacks
    if (processedEvents.length < minResults) {
      // Second strategy: Try to fetch events by tags
      const fallbackQuery = supabase
        .from('events')
        .select(`
          *,
          creator:profiles(*),
          venues:venue_id(*)
        `)
        .neq('id', currentEventId)
        .gte('start_date', today)
        .order('start_date', { ascending: true })
        .limit(10);
      
      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError || !fallbackData) {
        return processedEvents;
      }
      
      // Process the fallback events with user RSVP info
      const fallbackProcessed = processEventsData(fallbackData, userId);
      
      // If we have tags, sort the fallback events by tag relevance
      const sortedFallbacks = tags.length > 0
        ? sortByTagRelevance(fallbackProcessed, tags)
        : fallbackProcessed;
      
      // Combine unique events from both queries
      const combinedEvents = [...processedEvents];
      for (const event of sortedFallbacks) {
        if (!combinedEvents.some(e => e.id === event.id)) {
          combinedEvents.push(event);
          if (combinedEvents.length >= minResults) break;
        }
      }
      
      return combinedEvents;
    }
    
    return processedEvents;
    
  } catch (error) {
    console.error('Error in fetchRelatedEvents:', error);
    return [];
  }
}

// Helper function to sort events by tag relevance
function sortByTagRelevance(events: Event[], tags: string[]): Event[] {
  return [...events].sort((a, b) => {
    const aTagsStr = String(a.tags || '');
    const bTagsStr = String(b.tags || '');
    
    const aMatchCount = tags.filter(tag => aTagsStr.includes(tag)).length;
    const bMatchCount = tags.filter(tag => bTagsStr.includes(tag)).length;
    
    return bMatchCount - aMatchCount;
  });
}
