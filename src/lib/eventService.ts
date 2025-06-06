import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { filterEventsByTime, shouldShowEvent } from '@/utils/eventTimeFiltering';
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
    const event = processedEvents[0] || null;
    
    // Check if event should still be visible based on timing rules
    if (event && !shouldShowEvent(event)) {
      console.log(`Event ${eventId} is no longer visible due to timing rules`);
      return null;
    }
    
    return event;

  } catch (error) {
    console.error("Unexpected error fetching event by ID:", error);
    return null;
  }
};

/**
 * Fetches event attendees by status (Going/Interested)
 */
export const fetchEventAttendees = async (eventId: string) => {
  try {
    console.log('Fetching attendees for event:', eventId);
    
    // Get "Going" attendees
    const { data: goingData, error: goingError } = await supabase
      .from('event_rsvps')
      .select(`
        status,
        profiles!inner(*)
      `)
      .eq('event_id', eventId)
      .eq('status', 'Going');

    if (goingError) {
      console.error('Error fetching Going attendees:', goingError);
      throw goingError;
    }

    // Get "Interested" attendees
    const { data: interestedData, error: interestedError } = await supabase
      .from('event_rsvps')
      .select(`
        status,
        profiles!inner(*)
      `)
      .eq('event_id', eventId)
      .eq('status', 'Interested');

    if (interestedError) {
      console.error('Error fetching Interested attendees:', interestedError);
      throw interestedError;
    }

    // Process going attendees
    const goingAttendees = goingData?.map(item => {
      if (!item.profiles) return null;
      return item.profiles;
    }).filter(Boolean) || [];

    // Process interested attendees
    const interestedAttendees = interestedData?.map(item => {
      if (!item.profiles) return null;
      return item.profiles;
    }).filter(Boolean) || [];

    return {
      going: goingAttendees,
      interested: interestedAttendees,
    };
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    return { going: [], interested: [] };
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

    // Process events data and apply time-based filtering
    const processedEvents = processEventsData(data, userId);
    const filteredEvents = filterEventsByTime(processedEvents);
    
    return filteredEvents.slice(0, minResults);

  } catch (error) {
    console.error("Unexpected error fetching similar events:", error);
    return [];
  }
};

/**
 * Searches events based on a query string
 */
export const searchEvents = async (query: string, userId: string | undefined = undefined): Promise<Event[]> => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.trim();
    
    // Search events by title, description, location, or tags
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:profiles(id, username, avatar_url, email, location, status, tagline),
        venues:venue_id(*),
        event_rsvps(id, user_id, status)
      `)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%`)
      .order('start_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error("Error searching events:", error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Process the event data to include user's RSVP status
    const processedEvents = processEventsData(data, userId);
    
    // Apply time-based filtering to show only relevant events
    const filteredEvents = filterEventsByTime(processedEvents);
    
    return filteredEvents;

  } catch (error) {
    console.error("Unexpected error searching events:", error);
    return [];
  }
};
