import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { asEqParam } from '@/utils/supabaseTypeUtils';

export const fetchEventById = async (eventId: string, userId?: string): Promise<Event | null> => {
  try {
    console.log(`fetchEventById: Fetching event ${eventId} for user ${userId}`);
    
    if (!eventId) {
      console.error('fetchEventById: No eventId provided');
      return null;
    }

    // Build the query to fetch event with related data
    let query = supabase
      .from('events')
      .select(`
        *,
        venues!events_venue_id_fkey(*),
        event_rsvps!left(id, user_id, status)
      `)
      .eq('id', asEqParam(eventId));

    // If user is provided, filter RSVPs to only include current user's RSVPs
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`, { foreignTable: 'event_rsvps' });
    }

    const { data: eventData, error: eventError } = await query.single();

    if (eventError) {
      console.error('fetchEventById: Error fetching event:', eventError);
      
      // If it's a 'not found' error, return null instead of throwing
      if (eventError.code === 'PGRST116') {
        console.log(`fetchEventById: Event ${eventId} not found`);
        return null;
      }
      
      throw eventError;
    }

    if (!eventData) {
      console.log(`fetchEventById: No event data found for ID ${eventId}`);
      return null;
    }

    console.log('fetchEventById: Event data retrieved:', eventData);

    // Fetch creator profile separately to avoid foreign key issues
    let creatorData = null;
    if (eventData.creator) {
      const { data: creator, error: creatorError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, email, location, status, tagline')
        .eq('id', asEqParam(eventData.creator))
        .maybeSingle();
        
      if (!creatorError && creator) {
        creatorData = creator;
      }
    }

    // Process the event data
    const processedEvent = {
      ...eventData,
      creator: creatorData,
      // Extract RSVP status for the current user
      rsvp_status: userId && eventData.event_rsvps?.length > 0 
        ? eventData.event_rsvps.find((rsvp: any) => rsvp.user_id === userId)?.status || null
        : null,
      // Remove the event_rsvps array to avoid confusion
      event_rsvps: undefined
    };

    console.log(`fetchEventById: Processed event with RSVP status: ${processedEvent.rsvp_status}`);
    
    return processedEvent;
  } catch (error) {
    console.error('fetchEventById: Unexpected error:', error);
    return null;
  }
};

export const fetchEventAttendees = async (eventId: string) => {
  try {
    console.log(`fetchEventAttendees: Fetching attendees for event ${eventId}`);
    
    const { data: rsvps, error } = await supabase
      .from('event_rsvps')
      .select(`
        id,
        status,
        user_id,
        profiles!event_rsvps_user_id_fkey(
          id,
          username,
          avatar_url
        )
      `)
      .eq('event_id', asEqParam(eventId))
      .in('status', ['Going', 'Interested']);

    if (error) {
      console.error('fetchEventAttendees: Error:', error);
      throw error;
    }

    const going = rsvps?.filter(rsvp => rsvp.status === 'Going') || [];
    const interested = rsvps?.filter(rsvp => rsvp.status === 'Interested') || [];

    console.log(`fetchEventAttendees: Found ${going.length} going, ${interested.length} interested`);
    
    return { going, interested };
  } catch (error) {
    console.error('fetchEventAttendees: Unexpected error:', error);
    return { going: [], interested: [] };
  }
};

export const createEvent = async (eventData: any) => {
  try {
    console.log('🏗️ createEvent: Creating event with data:', eventData);
    console.log('🔍 createEvent: Data types check:', {
      title: typeof eventData.title,
      start_datetime: typeof eventData.start_datetime,
      creator: typeof eventData.creator,
      venue_name: typeof eventData.venue_name,
      address: typeof eventData.address,
      postal_code: typeof eventData.postal_code
    });
    
    // Clean up the data by removing any undefined or null fields that shouldn't be there
    const cleanedData = Object.fromEntries(
      Object.entries(eventData).filter(([_, value]) => value !== undefined)
    );
    
    console.log('✨ createEvent: Cleaned event data:', cleanedData);
    console.log('📊 createEvent: Cleaned data field count:', Object.keys(cleanedData).length);
    
    console.log('🔄 createEvent: Attempting to insert into database...');
    const { data, error } = await supabase
      .from('events')
      .insert([cleanedData])
      .select()
      .single();

    if (error) {
      console.error('❌ createEvent: Error creating event:', error);
      console.error('❌ createEvent: Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      console.error('❌ createEvent: Data that failed to insert:', cleanedData);
      return { data: null, error };
    }

    console.log('✅ createEvent: Event created successfully:', data);
    console.log('🎉 createEvent: Created event ID:', data?.id);
    return { data, error: null };
  } catch (error) {
    console.error('createEvent: Unexpected error:', error);
    return { data: null, error };
  }
};

export const updateEvent = async (eventId: string, eventData: any) => {
  try {
    console.log(`updateEvent: Updating event ${eventId} with data:`, eventData);
    
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('updateEvent: Error updating event:', error);
      return { data: null, error };
    }

    console.log('updateEvent: Event updated successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('updateEvent: Unexpected error:', error);
    return { data: null, error };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    console.log(`deleteEvent: Deleting event ${eventId}`);
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('deleteEvent: Error deleting event:', error);
      return { error };
    }

    console.log('deleteEvent: Event deleted successfully');
    return { error: null };
  } catch (error) {
    console.error('deleteEvent: Unexpected error:', error);
    return { error };
  }
};
