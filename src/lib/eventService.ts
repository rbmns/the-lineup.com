
import { supabase } from '@/lib/supabase';
import { Event, Venue } from '@/types';
import { subMinutes } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE } from '@/utils/dateUtils';

// Helper function to safely type-cast Supabase responses
function safeTypeCast<T>(data: any): T | null {
  if (!data) return null;
  return data as T;
}

/**
 * Event Service - Handles all event-related data operations
 */
export const EventService = {
  // Fetch all events
  async getEvents(): Promise<Event[]> {
    try {
      // Get the current time minus 30 minutes to filter events
      const thirtyMinutesAgo = subMinutes(new Date(), 30);
      const cutoffDate = toZonedTime(thirtyMinutesAgo, AMSTERDAM_TIMEZONE).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url),
          venues:venue_id(*)
        `)
        .gte('start_date', cutoffDate) // Use start_date for initial filtering
        .order('start_date', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },
  
  // Create a new venue
  async createVenue(venueData: Partial<Venue>): Promise<string | null> {
    try {
      // Create venue with only the defined fields
      const insertData: any = {};
      if (venueData.name) insertData.name = venueData.name;
      if (venueData.street) insertData.street = venueData.street;
      if (venueData.city) insertData.city = venueData.city;
      if (venueData.postal_code) insertData.postal_code = venueData.postal_code;
      if (venueData.google_maps) insertData.google_maps = venueData.google_maps;
      if (venueData.website) insertData.website = venueData.website;
      
      const { data, error } = await supabase
        .from('venues')
        .insert(insertData)
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Safely check if data exists and has an id property
      if (data && 'id' in data) {
        return data.id as string;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating venue:', error);
      return null;
    }
  },
  
  // Create a new event
  async createEvent(eventData: Partial<Event>): Promise<string | null> {
    try {
      // Type-safe insertion with proper casting
      const insertData: any = {
        title: eventData.title || '',
        description: eventData.description || '',
        event_type: eventData.event_type || 'other',
        start_time: eventData.start_time || new Date().toISOString(),
        end_time: eventData.end_time || new Date().toISOString()
      };
      
      // Only add optional fields if they exist
      if (eventData.venue_id) insertData.venue_id = eventData.venue_id;
      if (eventData.image_urls) insertData.image_urls = eventData.image_urls;
      if (eventData.organizer_link) insertData.organizer_link = eventData.organizer_link;
      if (eventData.fee !== undefined) insertData.fee = eventData.fee;
      if (eventData.booking_link) insertData.booking_link = eventData.booking_link;
      if (eventData.extra_info) insertData["Extra info"] = eventData.extra_info;
      if (eventData.tags) {
        insertData.tags = Array.isArray(eventData.tags) ? eventData.tags.join(',') : eventData.tags;
      }
      if (eventData.created_by) insertData.creator = eventData.created_by;
      
      const { data, error } = await supabase
        .from('events')
        .insert(insertData)
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Safely check if data exists and has an id property
      return data?.id ? data.id as string : null;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },
  
  // Get event by ID
  async getEventById(eventId: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url),
          venues:venue_id(*)
        `)
        .eq('id', eventId)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Event;
    } catch (error) {
      console.error(`Error fetching event with ID ${eventId}:`, error);
      return null;
    }
  },
  
  // Update an existing event
  async updateEvent(eventId: string, eventData: Partial<Event>): Promise<boolean> {
    try {
      // Type-safe update with proper casting
      const updateData: any = {};
      
      // Only include fields that are provided
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.event_type !== undefined) updateData.event_type = eventData.event_type;
      
      // Handle the new date/time fields
      if (eventData.start_time !== undefined) {
        if (typeof eventData.start_time === 'string' && eventData.start_time.includes('T')) {
          // If ISO datetime string is provided, split into date and time parts
          const datePart = eventData.start_time.split('T')[0];
          const timePart = eventData.start_time.split('T')[1].substring(0, 8); // HH:MM:SS
          updateData.start_date = datePart;
          updateData.start_time = timePart;
        }
      }
      
      if (eventData.end_time !== undefined) {
        if (typeof eventData.end_time === 'string' && eventData.end_time.includes('T')) {
          // If ISO datetime string is provided, extract time part
          updateData.end_time = eventData.end_time.split('T')[1].substring(0, 8); // HH:MM:SS
        } else {
          updateData.end_time = eventData.end_time;
        }
      }
      
      if (eventData.venue_id !== undefined) updateData.venue_id = eventData.venue_id;
      if (eventData.image_urls !== undefined) updateData.image_urls = eventData.image_urls;
      if (eventData.organizer_link !== undefined) updateData.organizer_link = eventData.organizer_link;
      if (eventData.fee !== undefined) updateData.fee = eventData.fee;
      if (eventData.booking_link !== undefined) updateData.booking_link = eventData.booking_link;
      if (eventData.extra_info !== undefined) updateData["Extra info"] = eventData.extra_info;
      if (eventData.tags !== undefined) {
        updateData.tags = Array.isArray(eventData.tags) ? eventData.tags.join(',') : eventData.tags;
      }
      
      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Error updating event with ID ${eventId}:`, error);
      return false;
    }
  },
  
  // Delete an event
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting event with ID ${eventId}:`, error);
      return false;
    }
  }
};

export default EventService;
