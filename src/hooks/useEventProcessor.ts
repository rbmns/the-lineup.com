
import { Event, Venue } from '@/types';
import { processImageUrls } from '@/utils/imageUtils';

// Helper function to safely process venue data
const processVenueData = (venues: any): Venue | null => {
  if (!venues || typeof venues !== 'object' || Array.isArray(venues)) {
    return null;
  }
  
  return {
    id: venues.id || '',
    name: venues.name || '',
    street: venues.street || '',
    postal_code: venues.postal_code || '',
    city: venues.city || '',
    website: venues.website,
    google_maps: venues.google_maps,
    region: venues.region,
    tags: venues.tags
  };
};

export const useEventProcessor = () => {
  const processEventData = (event: any, currentUserId?: string): Event => {
    const creatorProfile = event.creator && Array.isArray(event.creator) && event.creator.length > 0 
      ? event.creator[0] 
      : null;
    
    const venueData = processVenueData(event.venues);
    
    return {
      id: event.id,
      title: event.title,
      description: event.description || '',
      // Only include location if it exists in the event data
      ...(event.location && { location: event.location }),
      event_category: event.event_category,
      start_time: event.start_time,
      end_time: event.end_time,
      created_at: event.created_at,
      updated_at: event.updated_at,
      image_urls: processImageUrls(event.image_urls),
      attendees: {
        going: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0,
        interested: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0
      },
      rsvp_status: currentUserId 
        ? (event.event_rsvps?.find((rsvp: any) => rsvp.user_id === currentUserId)?.status as 'Interested' | 'Going' | undefined)
        : undefined,
      google_maps: venueData?.google_maps || null,
      organizer_link: event.organizer_link || null,
      booking_link: event.booking_link || null,
      creator: creatorProfile,
      venues: venueData,
      extra_info: event["Extra info"] || null,
      fee: event.fee,
      venue_id: event.venue_id,
      tags: Array.isArray(event.tags) ? event.tags : (event.tags ? [event.tags] : []),
      status: event.status,
      ...(event.coordinates && { coordinates: event.coordinates }),
      ...(event.created_by && { created_by: event.created_by })
    };
  };

  return {
    processEventData
  };
};
