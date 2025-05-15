
import { Event, UserProfile, Venue } from '@/types';
import { getEventFallbackImage } from '@/utils/eventImages';
import { combineDateAndTime, getEventDateTime, getEventEndDateTime } from '@/utils/dateUtils';

/**
 * Process raw event data from Supabase into the application's Event type
 */
export function processEventData(event: any, userId?: string | undefined): Event {
  if (!event) {
    console.error('Attempted to process undefined event data');
    return {} as Event;
  }

  try {
    // Process creator profile
    const creatorProfile = event.creator && Array.isArray(event.creator) && event.creator.length > 0 
      ? event.creator[0] as unknown as UserProfile
      : null;

    // Process venue data safely
    let venueData: Venue | null = null;
    
    if (event.venues && 
        typeof event.venues === 'object' && 
        event.venues !== null && 
        !Array.isArray(event.venues)) {
      venueData = {
        id: (event.venues)?.id || '',
        name: (event.venues)?.name || '',
        street: (event.venues)?.street || '',
        postal_code: (event.venues)?.postal_code || '',
        city: (event.venues)?.city || '',
        website: (event.venues)?.website,
        google_maps: (event.venues)?.google_maps,
        region: (event.venues)?.region,
        tags: (event.venues)?.tags
      };
    }
    
    // Get the default image if no images are present
    const eventType = event.event_type as string;
    const defaultImage = getEventFallbackImage(eventType);
    const imageUrls = event.image_urls && event.image_urls.length > 0 
      ? event.image_urls
      : [defaultImage];
      
    // Count RSVPs by status
    const goingCount = event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0;
    const interestedCount = event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0;
    
    // Check if current user has RSVP'd
    const userRsvp = userId && event.event_rsvps
      ? event.event_rsvps.find((rsvp: any) => rsvp.user_id === userId)?.status
      : undefined;
    
    // Generate the start and end time ISO strings from the new date and time fields
    const startTimeISO = getEventDateTime(event);
    const endTimeISO = getEventEndDateTime(event);
      
    return {
      id: event.id,
      title: event.title,
      description: event.description || '',
      location: venueData?.city || 'Location not specified',
      event_type: event.event_type,
      start_time: startTimeISO,
      end_time: endTimeISO,
      start_date: event.start_date,  // Include original fields for compatibility
      created_at: event.created_at,
      updated_at: event.updated_at,
      image_urls: imageUrls,
      attendees: {
        going: goingCount,
        interested: interestedCount
      },
      rsvp_status: userRsvp as 'Interested' | 'Going' | undefined,
      area: null,
      google_maps: venueData?.google_maps || null,
      organizer_link: event.organizer_link || null,
      creator: creatorProfile,
      venues: venueData,
      extra_info: event["Extra info"] || null,
      fee: event.fee,
      venue_id: event.venue_id,
      tags: Array.isArray(event.tags) ? event.tags : 
            (typeof event.tags === 'string' ? [event.tags] : []),
      destination: event.destination,
      slug: event.slug
    } as Event;
  } catch (error) {
    console.error('Error processing event data:', error, event);
    return {} as Event;
  }
}

/**
 * Process multiple events from raw Supabase data
 */
export function processEventsData(data: any[], userId?: string): Event[] {
  if (!Array.isArray(data)) return [];
  
  try {
    return data.map(event => processEventData(event, userId));
  } catch (error) {
    console.error('Error processing events data:', error);
    return [];
  }
}
