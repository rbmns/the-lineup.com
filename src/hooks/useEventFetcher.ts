
import { useState, useCallback } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { processEventData } from '@/utils/eventProcessorUtils';
import { asEqParam } from '@/utils/supabaseTypeUtils';
import { useEventLookup } from './useEventLookup';
import { useEventRSVP } from './event-rsvp/useEventRSVP';
import { toast } from './use-toast';

export const useEventFetcher = (
  userId?: string
) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attendees, setAttendees] = useState<{ going: any[]; interested: any[]; }>({ going: [], interested: [] });
  const { lookupEventBySlug, lookupEventById } = useEventLookup();
  const { getAttendeesForEvent } = useEventRSVP();
  
  const fetchEventById = useCallback(async (eventId: string) => {
    try {
      console.log(`Fetching event details for eventId=${eventId}, userId=${userId}`);
      
      let userRsvpStatus;
      if (userId) {
        const { data: rsvpData, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select('status')
          .eq('event_id', asEqParam(eventId))
          .eq('user_id', asEqParam(userId))
          .maybeSingle();
        
        if (rsvpError) {
          console.error("Error fetching RSVP status:", rsvpError);
        } else if (rsvpData) {
          userRsvpStatus = rsvpData.status as 'Going' | 'Interested' | undefined;
          console.log("User RSVP status:", userRsvpStatus);
        }
      }
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles!creator(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .eq('id', asEqParam(eventId))
        .maybeSingle();

      if (error) {
        console.error("Error fetching event:", error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Error in fetchEventById:", err);
      throw err;
    }
  }, [userId]);

  const fetchEventAndAttendees = useCallback(async (
    eventId?: string,
    eventSlug?: string,
    destination?: string
  ) => {
    try {
      setIsLoading(true);
      
      let eventData;
      let eventIdToUse = eventId;
      
      // First, try to check if the provided "slug" is actually a UUID (event ID)
      const isValidUUID = eventSlug && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventSlug);
      
      // If what we have in the "slug" parameter is actually a UUID, try looking it up as an ID first
      if (isValidUUID) {
        console.log(`Detected UUID pattern in slug parameter: ${eventSlug}. Trying direct ID lookup first...`);
        eventData = await lookupEventById(eventSlug);
        if (eventData) {
          console.log(`Successfully found event with ID ${eventSlug}`);
          eventIdToUse = eventSlug;
        }
      }
      
      // If we still don't have an event and we have destination + slug, try that lookup
      if (!eventData && destination && eventSlug) {
        console.log(`Attempting to fetch event by destination and slug: ${destination}/${eventSlug}`);
        const citySlugLookupResult = await lookupEventBySlug(eventSlug, destination);
        
        if (citySlugLookupResult) {
          eventData = citySlugLookupResult;
          eventIdToUse = citySlugLookupResult.id;
          console.log(`Found event with id ${eventIdToUse} for destination ${destination} and slug ${eventSlug}`);
        } else {
          console.log(`No event found for destination ${destination} and slug ${eventSlug}`);
          // Fall back to just slug lookup if destination and slug combo fails
          const slugLookupResult = await lookupEventBySlug(eventSlug);
          
          if (slugLookupResult) {
            eventData = slugLookupResult;
            eventIdToUse = slugLookupResult.id;
            console.log(`Found event with id ${eventIdToUse} for slug ${eventSlug} (without destination match)`);
          } else if (eventId) {
            // If we have an explicit eventId parameter, use that as a last resort
            console.log(`No event found for slug: ${eventSlug}, falling back to ID lookup: ${eventId}`);
            eventData = await lookupEventById(eventId);
            eventIdToUse = eventId;
          } else {
            console.log(`No event found for slug: ${eventSlug}`);
            setError(new Error("Event not found"));
            setIsLoading(false);
            return null;
          }
        }
      }
      // If we have just the slug, try to look it up
      else if (eventSlug && !eventData) {
        console.log(`Attempting to fetch event by slug: ${eventSlug}`);
        const slugLookupResult = await lookupEventBySlug(eventSlug);
        
        if (slugLookupResult) {
          eventData = slugLookupResult;
          eventIdToUse = slugLookupResult.id;
          console.log(`Found event with id ${eventIdToUse} for slug ${eventSlug}`);
        } else {
          // Try direct ID lookup as a fallback
          console.log(`No event found for slug: ${eventSlug}, trying as direct ID...`);
          eventData = await lookupEventById(eventSlug);
          
          if (eventData) {
            eventIdToUse = eventSlug;
            console.log(`Found event directly with ID ${eventIdToUse}`);
          } else {
            console.log(`No event found for slug or ID: ${eventSlug}`);
            setError(new Error("Event not found"));
            setIsLoading(false);
            return null;
          }
        }
      } else if (!eventId && !eventData) {
        setError(new Error("Event ID, slug, or destination+slug is required"));
        setIsLoading(false);
        return null;
      }
      
      if (!eventData && eventIdToUse) {
        eventData = await fetchEventById(eventIdToUse);
      }

      if (eventData) {
        if (typeof eventData === 'object') {
          const processedEventData = processEventData(eventData, userId);
          
          if (userId && eventData.rsvp_status) {
            processedEventData.rsvp_status = eventData.rsvp_status;
          }

          setEvent(processedEventData);

          try {
            // Fetch regular attendees
            const attendeeData = await getAttendeesForEvent(processedEventData.id);
            console.log("Fetched attendees:", attendeeData);
            setAttendees(attendeeData);
          } catch (attendeesError) {
            console.error("Error fetching attendees:", attendeesError);
            setAttendees({ going: [], interested: [] });
          }
          
          return processedEventData;
        } else {
          console.error("Invalid event data format:", eventData);
          setError(new Error("Invalid event data format"));
          return null;
        }
      } else {
        setError(new Error("Event not found"));
        return null;
      }
    } catch (err) {
      console.error("Error fetching event or attendees:", err);
      setError(err instanceof Error ? err : new Error("Failed to load event details"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchEventById, lookupEventBySlug, lookupEventById, userId, getAttendeesForEvent]);
  
  return {
    event,
    setEvent,
    attendees,
    setAttendees,
    isLoading,
    setIsLoading,
    error,
    setError,
    fetchEventAndAttendees
  };
};
