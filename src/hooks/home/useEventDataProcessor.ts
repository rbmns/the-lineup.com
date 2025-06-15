
import { Event, UserProfile, Venue } from '@/types';

export const processEventData = (event: any): Event => {
  const creatorProfile = event.creator && event.creator.length > 0 
    ? event.creator[0] as unknown as UserProfile
    : null;

  let venueData: Venue | null = null;
  
  if (event.venues && 
      typeof event.venues === 'object' && 
      event.venues !== null && 
      !Array.isArray(event.venues)) {
    venueData = {
      id: (event.venues as any)?.id || '',
      name: (event.venues as any)?.name || '',
      street: (event.venues as any)?.street || '',
      postal_code: (event.venues as any)?.postal_code || '',
      city: (event.venues as any)?.city || '',
      website: (event.venues as any)?.website,
      google_maps: (event.venues as any)?.google_maps,
      region: (event.venues as any)?.region,
      tags: (event.venues as any)?.tags
    };
  }
    
  return {
    id: event.id,
    title: event.title,
    description: event.description || '',
    location: event.location,
    event_category: event.event_category, // Changed from event_type to event_category
    start_time: event.start_time,
    end_time: event.end_time,
    created_at: event.created_at,
    updated_at: event.updated_at,
    image_urls: event.image_urls || [],
    attendees: {
      going: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0,
      interested: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0
    },
    rsvp_status: event.user_id 
      ? (event.event_rsvps?.find((rsvp: any) => rsvp.user_id === event.user_id)?.status as 'Interested' | 'Going' | undefined)
      : undefined,
    area: null,
    google_maps: venueData?.google_maps || null,
    organizer_link: event.organizer_link || null,
    creator: creatorProfile,
    venues: venueData,
    extra_info: event["Extra info"] || null,
    fee: event.fee,
    venue_id: event.venue_id,
    status: event.status,
    tags: event.tags ? (typeof event.tags === 'string' ? [event.tags] : event.tags) : []
  } as Event;
};
