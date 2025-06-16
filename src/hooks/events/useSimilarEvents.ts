import { useState, useCallback } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { filterUpcomingEvents } from '@/utils/dateUtils';

export const useSimilarEvents = (selectedEventTypes: string[], selectedVenues: string[]) => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to process event results
  const processEventResults = (data: any[], isExactMatch: boolean = true): Event[] => {
    return data.map(item => {
      const eventRsvps = item.event_rsvps || [];
      
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        start_time: item.start_time,
        end_time: item.end_time,
        created_at: item.created_at,
        updated_at: item.updated_at,
        venue_id: item.venue_id,
        venues: item.venues,
        event_category: item.event_category,
        creator: item.creator,
        image_urls: item.image_urls || [],
        fee: item.fee,
        tags: item.tags,
        status: item.status,
        rsvp_status: undefined,
        isExactMatch: isExactMatch,
        attendees: {
          going: eventRsvps.filter((rsvp: any) => rsvp.status === 'Going').length,
          interested: eventRsvps.filter((rsvp: any) => rsvp.status === 'Interested').length
        }
      } as Event;
    }).filter(event => {
      // Filter to make sure we only return future events
      if (!event.start_time) return false;
      const eventDate = new Date(event.start_time);
      return eventDate >= new Date();
    });
  };

  // Function to escape special characters in tags for SQL like pattern
  const escapeTagForLike = (tag: string): string => {
    if (!tag) return '';
    return tag.replace(/[%_]/g, '\\$&');
  }

  // Function to fetch similar events based on event types
  const fetchSimilarEvents = useCallback(async (eventTypes: string[]): Promise<Event[]> => {
    setIsLoading(true);
    try {
      console.log("Fetching similar events with event types:", eventTypes);
      
      // Start building the query for similar events
      let query = supabase.from('events').select(`
        *,
        creator:profiles(id, username, avatar_url, email, location, status, tagline),
        venues:venue_id(*),
        event_rsvps(id, user_id, status)
      `);
      
      // Only exclude events that would have matched the exact filters
      if (selectedEventTypes.length > 0) {
        query = query.not('event_category', 'in', `(${selectedEventTypes.join(',')})`);
      }
      
      if (selectedVenues.length > 0) {
        query = query.not('venue_id', 'in', `(${selectedVenues.join(',')})`);
      }
      
      // If provided with specific event types for similar events, use them
      if (eventTypes.length > 0) {
        // Look for events with similar but not identical event types
        // This is a simplification - in a real app, you might have a more complex similarity algorithm
        const eventTypeList = eventTypes.join(',');
        console.log(`Using event type filter: (${eventTypeList})`);
      }
      
      // Limit results and order by start time
      query = query.order('start_time', { ascending: true }).limit(12);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error in similar events query:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Mark these as similar results, not exact matches
        return processEventResults(data, false);
      }
      
      // If we didn't get results with the targeted approach, try a more general query
      // to ensure we always return some results
      const fallbackQuery = supabase.from('events').select(`
        *,
        creator:profiles(id, username, avatar_url, email, location, status, tagline),
        venues:venue_id(*),
        event_rsvps(id, user_id, status)
      `)
      .order('start_time', { ascending: true })
      .limit(12);
      
      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError) throw fallbackError;
      
      if (fallbackData && fallbackData.length > 0) {
        // Mark these as definitely not exact matches
        return processEventResults(fallbackData, false);
      }
      
      return [];
    } catch (err) {
      console.error('Error fetching similar events:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventTypes, selectedVenues]);

  return { fetchSimilarEvents, isLoading };
};
