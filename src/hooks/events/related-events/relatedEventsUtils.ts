
import { Event } from '@/types';
import { compareAsc, differenceInDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE } from '@/utils/date-formatting';
import { EventRsvpMap } from './types';
import { supabase } from '@/lib/supabase';

/**
 * Calculate a relevance score between two events
 * Higher score means more relevant
 */
export const calculateRelevanceScore = (
  eventA: Event,
  eventB: Event,
  weights = {
    eventType: 10,     // Highest weight - same type is very relevant
    dateDifference: 5, // Date proximity is important
    venue: 3,          // Same venue is somewhat important
    tags: 2,           // Tag matches add relevance
    creator: 1         // Same creator adds a bit of relevance
  }
): number => {
  let score = 0;
  
  // Event category match (highest weight)
  if (eventA.event_category === eventB.event_category) {
    score += weights.eventType;
  }
  
  // Date proximity (closer dates = higher score)
  if (eventA.start_date && eventB.start_date) {
    const dateA = new Date(eventA.start_date);
    const dateB = new Date(eventB.start_date);
    
    // Calculate days between events (absolute value)
    const daysDifference = Math.abs(differenceInDays(dateA, dateB));
    
    // Score inversely proportional to day difference
    // Max 10 points if same day, down to 0 if 14+ days apart
    const dateProximityScore = Math.max(0, weights.dateDifference - (daysDifference / 3));
    score += dateProximityScore;
  }
  
  // Venue match
  if (eventA.venue_id && eventB.venue_id && eventA.venue_id === eventB.venue_id) {
    score += weights.venue;
  }
  
  // Tag matches
  if (eventA.tags && eventB.tags) {
    const tagsA = Array.isArray(eventA.tags) 
      ? eventA.tags 
      : String(eventA.tags || '').split(',').map(t => t.trim());
      
    const tagsB = Array.isArray(eventB.tags) 
      ? eventB.tags 
      : String(eventB.tags || '').split(',').map(t => t.trim());
    
    // Count matching tags
    const matchingTags = tagsA.filter(tag => tagsB.includes(tag));
    score += matchingTags.length * weights.tags;
  }
  
  // Creator match - Fix: using creator instead of creator_id
  if (eventA.creator && eventB.creator && eventA.creator.id === eventB.creator.id) {
    score += weights.creator;
  }
  
  return score;
};

/**
 * Apply RSVP status to events and format them correctly
 */
export const applyRsvpStatus = async (
  events: any[],
  userId?: string
): Promise<Event[]> => {
  try {
    if (!events || events.length === 0) return [];
    
    // Format dates and times according to requirements
    const formattedEvents = events.map(event => {
      // Format date as "day, date, month" (e.g., "Mon, 15 May")
      let formattedDate = '';
      if (event.start_date) {
        try {
          const startDate = new Date(event.start_date);
          formattedDate = formatInTimeZone(startDate, AMSTERDAM_TIMEZONE, "EEE, d MMM");
        } catch (err) {
          console.error('Error formatting date:', err);
        }
      }
      
      // Format time without seconds
      let formattedTime = '';
      if (event.start_time) {
        // Remove seconds if present
        const startTime = event.start_time.split(':').slice(0, 2).join(':');
        
        if (event.end_time) {
          // If we have end time, format as a range (also without seconds)
          const endTime = event.end_time.split(':').slice(0, 2).join(':');
          formattedTime = `${startTime} - ${endTime}`;
        } else {
          formattedTime = startTime;
        }
      }
      
      return {
        ...event,
        formattedDate,
        formattedTime,
        attendees: {
          going: event.going_count || 0,
          interested: event.interested_count || 0
        }
      };
    });
    
    // If we don't have a userId, just return the formatted events
    if (!userId) {
      return formattedEvents;
    }
    
    // Get all event IDs
    const eventIds = formattedEvents.map(event => event.id);
    
    // Fetch RSVP status for these events for the current user
    const { data: rsvpData, error: rsvpError } = await supabase
      .from('event_rsvps')
      .select('event_id, status')
      .eq('user_id', userId)
      .in('event_id', eventIds);
      
    if (rsvpError) {
      console.error('Error fetching RSVP status for events:', rsvpError);
      return formattedEvents;
    }
    
    // Create a map of event ID to RSVP status for quick lookup
    const rsvpMap: EventRsvpMap = {};
    if (rsvpData) {
      rsvpData.forEach(rsvp => {
        rsvpMap[rsvp.event_id] = rsvp.status as 'Going' | 'Interested';
      });
    }
    
    // Update the events with their RSVP status
    return formattedEvents.map(event => ({
      ...event,
      rsvp_status: rsvpMap[event.id]
    }));
  } catch (error) {
    console.error('Error in applyRsvpStatus:', error);
    return events.map(event => ({
      ...event,
      attendees: {
        going: 0,
        interested: 0
      }
    })) as Event[];
  }
};

/**
 * Sort events by relevance score compared to a reference event
 */
export const sortEventsByRelevance = (events: Event[], referenceEvent: Event): Event[] => {
  if (!referenceEvent || events.length === 0) return events;
  
  return [...events].sort((a, b) => {
    const scoreA = calculateRelevanceScore(referenceEvent, a);
    const scoreB = calculateRelevanceScore(referenceEvent, b);
    
    // Sort by score (descending)
    return scoreB - scoreA;
  });
};

/**
 * Sort events by tag match score (higher scores first)
 */
export const sortEventsByTagMatch = (events: Event[], tags: string[]): Event[] => {
  if (!tags || tags.length === 0) return events;
  
  return [...events].sort((a, b) => {
    // Calculate tag match score
    const aTagsStr = String(a.tags || '');
    const bTagsStr = String(b.tags || '');
    
    const aMatchCount = tags.filter(tag => aTagsStr.includes(tag)).length;
    const bMatchCount = tags.filter(tag => bTagsStr.includes(tag)).length;
    
    // Sort by match count (descending)
    return bMatchCount - aMatchCount;
  });
};

/**
 * Update local state of a specific event with fresh RSVP status
 */
export function updateEventRsvpStatus(
  events: Event[],
  eventId: string,
  newStatus: 'Going' | 'Interested' | null
): Event[] {
  return events.map(event => {
    if (event.id === eventId) {
      return {
        ...event,
        rsvp_status: newStatus as any // Update the specific event's RSVP status
      };
    }
    return event;
  });
}

/**
 * Helper to ensure only one status can be active at a time
 */
export function ensureSingleActiveStatus(
  events: Event[],
  eventId: string,
  newStatus: 'Going' | 'Interested' | null
): Event[] {
  // First pass: update the target event
  const updatedEvents = updateEventRsvpStatus(events, eventId, newStatus);
  
  // Sanity check to prevent multiple statuses
  return updatedEvents.map(event => {
    // Skip further processing for non-target events
    if (event.id !== eventId) {
      return event;
    }
    
    // For the target event, ensure only one status is active
    if (
      (newStatus === 'Going' && event.rsvp_status === 'Interested') ||
      (newStatus === 'Interested' && event.rsvp_status === 'Going')
    ) {
      return {
        ...event,
        rsvp_status: newStatus as any // Ensure only the new status is active
      };
    }
    
    return event;
  });
}
