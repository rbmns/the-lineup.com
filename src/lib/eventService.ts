import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { AMSTERDAM_TIMEZONE } from '@/utils/date-formatting';

/**
 * Fetches a single event by its ID.
 * Includes related data from the 'profiles' and 'venues' tables.
 */
export const fetchEventById = async (eventId: string, userId: string | undefined = undefined): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:profiles(id, username, avatar_url, email, location, status, tagline),
        venues:venue_id(*),
        event_rsvps(id, user_id, status)
      `)
      .eq('id', eventId)
      .single();

    if (error) {
      console.error("Error fetching event by ID:", error);
      return null;
    }

    if (!data) {
      console.log(`Event with ID ${eventId} not found.`);
      return null;
    }
    
    // Process the event data to include user's RSVP status
    const processedEvents = processEventsData([data], userId);
    return processedEvents[0] || null;

  } catch (error) {
    console.error("Unexpected error fetching event by ID:", error);
    return null;
  }
};

/**
 * Updates the RSVP status for an event.
 */
export const updateEventRsvp = async (eventId: string, userId: string, status: 'Going' | 'Interested' | null): Promise<boolean> => {
  try {
    if (!eventId || !userId) {
      console.warn("Event ID or User ID is missing.");
      return false;
    }

    // First, check if an RSVP record already exists for this user and event
    const { data: existingRsvp, error: selectError } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is the "no data found" error code
      console.error("Error checking existing RSVP:", selectError);
      return false;
    }

    if (existingRsvp) {
      // If an RSVP record exists, update it
      const { error: updateError } = await supabase
        .from('event_rsvps')
        .update({ status })
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (updateError) {
        console.error("Error updating RSVP:", updateError);
        return false;
      }
    } else {
      // If no RSVP record exists, create a new one
      const { error: insertError } = await supabase
        .from('event_rsvps')
        .insert([{ event_id: eventId, user_id: userId, status }]);

      if (insertError) {
        console.error("Error creating RSVP:", insertError);
        return false;
      }
    }

    // If all operations were successful, return true
    return true;

  } catch (error) {
    console.error("Error updating event RSVP:", error);
    return false;
  }
};

/**
 * Fetches similar events based on event type and tags.
 */
export const fetchSimilarEvents = async (
  currentEventId: string,
  eventType: string,
  tags: string[],
  vibe: string | undefined,
  startDate: string,
  minResults: number = 2,
  userId: string | undefined = undefined
): Promise<Event[]> => {
  try {
    // Construct the base query
    let query = supabase
      .from('events')
      .select(`
        *,
        creator:profiles(id, username, avatar_url, email, location, status, tagline),
        venues:venue_id(*),
        event_rsvps(id, user_id, status)
      `)
      .neq('id', currentEventId) // Exclude the current event
      .gte('start_date', startDate) // Only include events on or after the current event's start date
      .order('start_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(minResults * 3); // Initial limit to allow for filtering

    // Filter by event_type
    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    // Filter by vibe if it exists
    if (vibe) {
      query = query.eq('vibe', vibe);
    }

    // Filter by tags (if any)
    if (tags && tags.length > 0) {
      // Use ilike for each tag to perform a case-insensitive search
      const tagFilters = tags.map(tag => `tags.ilike.%${tag.trim()}%`);

      // Combine tag filters with OR
      const combinedTagFilter = tagFilters.join(',');

      // Apply the combined filter to the query
      query = query.or(combinedTagFilter);
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching similar events:", error);
      return [];
    }

    if (!data) {
      console.log("No similar events found.");
      return [];
    }

    // Process events data to include user's RSVP status and limit the results
    const processedEvents = processEventsData(data, userId);
    return processedEvents.slice(0, minResults);

  } catch (error) {
    console.error("Unexpected error fetching similar events:", error);
    return [];
  }
};
