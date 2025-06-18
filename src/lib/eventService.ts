
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { isUpcomingEvent, filterUpcomingEvents } from '@/utils/date-filtering';
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
        venues!events_venue_id_fkey(*),
        event_rsvps(id, user_id, status)
      `)
      .eq('id', eventId)
      .eq('status', 'published') // Only fetch published events
      .single();

    if (error) {
      console.error("Error fetching event by ID:", error);
      return null;
    }

    if (!data) {
      console.log(`Event with ID ${eventId} not found.`);
      return null;
    }
    
    // Fetch creator separately
    let creatorData = null;
    if (data.creator) {
      const { data: creator, error: creatorError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, email, location, status, tagline')
        .eq('id', data.creator)
        .single();
        
      if (!creatorError && creator) {
        creatorData = creator;
      }
    }
    
    // Combine event with creator data
    const eventWithCreator = {
      ...data,
      creator: creatorData
    };
    
    // Process the event data to include user's RSVP status
    const processedEvents = processEventsData([eventWithCreator], userId);
    const event = processedEvents[0] || null;
    
    // Check if event should still be visible based on timing rules
    if (event && !isUpcomingEvent(event)) {
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
        venues!events_venue_id_fkey(*),
        event_rsvps(id, user_id, status)
      `)
      .neq('id', currentEventId) // Exclude the current event
      .eq('status', 'published') // Only show published events
      .gte('start_date', startDate) // Only include events on or after the current event's start date
      .order('start_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(minResults * 3); // Initial limit to allow for filtering

    // Filter by event_category
    if (eventType) {
      query = query.eq('event_category', eventType);
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

    // Fetch creators separately for these events
    const creatorIds = data.map(event => event.creator).filter(Boolean);
    let creatorsData = [];
    
    if (creatorIds.length > 0) {
      const { data: creators, error: creatorsError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, email, location, status, tagline')
        .in('id', creatorIds);
        
      if (!creatorsError && creators) {
        creatorsData = creators;
      }
    }
    
    // Combine events with creator data
    const eventsWithCreators = data.map(event => ({
      ...event,
      creator: creatorsData.find(creator => creator.id === event.creator) || null
    }));

    // Process events data and apply time-based filtering
    const processedEvents = processEventsData(eventsWithCreators, userId);
    const filteredEvents = filterUpcomingEvents(processedEvents);
    
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
    
    // Search events by title, description, or tags
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venues!events_venue_id_fkey(*),
        event_rsvps(id, user_id, status)
      `)
      .eq('status', 'published') // Only show published events
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%`)
      .order('start_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error("Error searching events:", error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Fetch creators separately
    const creatorIds = data.map(event => event.creator).filter(Boolean);
    let creatorsData = [];
    
    if (creatorIds.length > 0) {
      const { data: creators, error: creatorsError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, email, location, status, tagline')
        .in('id', creatorIds);
        
      if (!creatorsError && creators) {
        creatorsData = creators;
      }
    }
    
    // Combine events with creator data
    const eventsWithCreators = data.map(event => ({
      ...event,
      creator: creatorsData.find(creator => creator.id === event.creator) || null
    }));

    // Process the event data to include user's RSVP status
    const processedEvents = processEventsData(eventsWithCreators, userId);
    
    // Apply time-based filtering to show only relevant events
    const filteredEvents = filterUpcomingEvents(processedEvents);
    
    return filteredEvents;

  } catch (error) {
    console.error("Unexpected error searching events:", error);
    return [];
  }
};

/**
 * Creates a new event.
 */
export const createEvent = async (eventData: Partial<Event>): Promise<{ data: Event | null; error: any }> => {
  // Ensure new events are created as published by default
  const eventWithStatus = {
    ...eventData,
    status: eventData.status || 'published'
  };
  
  const { data, error } = await supabase
    .from('events')
    .insert(eventWithStatus as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
  }

  return { data, error };
};

/**
 * Updates an existing event.
 */
export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<{ data: Event | null; error: any }> => {
  console.log('updateEvent called with eventId:', eventId, 'and data:', eventData);
  
  // First check if the event exists
  const { data: existingEvent, error: fetchError } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking if event exists:', fetchError);
    return { data: null, error: fetchError };
  }

  if (!existingEvent) {
    const notFoundError = {
      message: `Event with ID ${eventId} not found`,
      code: 'EVENT_NOT_FOUND'
    };
    console.error('Event not found for update:', notFoundError);
    return { data: null, error: notFoundError };
  }

  // Now update the event
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating event:', error);
    return { data: null, error };
  }

  if (!data) {
    const updateError = {
      message: 'Event update succeeded but no data returned',
      code: 'UPDATE_NO_DATA'
    };
    console.error('No data returned after update:', updateError);
    return { data: null, error: updateError };
  }

  console.log('Event updated successfully:', data);
  return { data, error: null };
};

/**
 * Deletes an event.
 */
export const deleteEvent = async (eventId: string): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
  }

  return { error };
};
