
import { Event, UserProfile, Venue } from '@/types';

export const processEventsData = (eventsData: any[], userId?: string): Event[] => {
  if (!eventsData || !Array.isArray(eventsData)) {
    return [];
  }

  return eventsData.map((eventData) => {
    // Process creator profile
    const creatorProfile = eventData.creator && eventData.creator.length > 0 
      ? eventData.creator[0] as unknown as UserProfile
      : null;

    // Process venue data - handle both direct venue object and array format
    let venueData: Venue | null = null;
    if (eventData.venues) {
      if (Array.isArray(eventData.venues) && eventData.venues.length > 0) {
        const venue = eventData.venues[0];
        venueData = {
          id: venue.id || '',
          name: venue.name || '',
          street: venue.street || '',
          postal_code: venue.postal_code || '',
          city: venue.city || '',
          website: venue.website || null,
          google_maps: venue.google_maps || null,
          region: venue.region || null,
          tags: venue.tags || null
        };
      } else if (typeof eventData.venues === 'object' && eventData.venues !== null) {
        venueData = {
          id: eventData.venues.id || '',
          name: eventData.venues.name || '',
          street: eventData.venues.street || '',
          postal_code: eventData.venues.postal_code || '',
          city: eventData.venues.city || '',
          website: eventData.venues.website || null,
          google_maps: eventData.venues.google_maps || null,
          region: eventData.venues.region || null,
          tags: eventData.venues.tags || null
        };
      }
    }

    // Determine user's RSVP status
    let rsvpStatus: 'Going' | 'Interested' | undefined = undefined;
    if (userId && eventData.event_rsvps && Array.isArray(eventData.event_rsvps)) {
      const userRsvp = eventData.event_rsvps.find((rsvp: any) => rsvp.user_id === userId);
      if (userRsvp) {
        rsvpStatus = userRsvp.status as 'Going' | 'Interested';
      }
    }

    // Count attendees by status
    const goingCount = eventData.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0;
    const interestedCount = eventData.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0;
    
    return {
      id: eventData.id,
      title: eventData.title,
      description: eventData.description || '',
      start_date: eventData.start_date,
      start_time: eventData.start_time,
      end_date: eventData.end_date,
      end_time: eventData.end_time,
      location: eventData.location,
      venue_id: eventData.venue_id,
      venues: venueData,
      creator: creatorProfile,
      event_category: eventData.event_category,
      tags: eventData.tags ? (typeof eventData.tags === 'string' ? [eventData.tags] : eventData.tags) : [],
      image_urls: eventData.image_urls || [],
      booking_link: eventData.booking_link || null,
      organizer_link: eventData.organizer_link || null,
      fee: eventData.fee,
      vibe: eventData.vibe || null,
      destination: eventData.destination,
      organiser_name: eventData.organiser_name || null,
      status: eventData.status,
      rsvp_status: rsvpStatus,
      going_count: goingCount,
      interested_count: interestedCount,
      attendees: {
        going: goingCount,
        interested: interestedCount
      },
      created_at: eventData.created_at,
      updated_at: eventData.updated_at,
      fixed_start_time: eventData.fixed_start_time || false,
      area: eventData.area || null,
      google_maps: venueData?.google_maps || eventData.google_maps || null,
      extra_info: eventData.extra_info || null,
      slug: eventData.slug,
      coordinates: eventData.coordinates,
      created_by: eventData.created_by || eventData.creator
    } as Event;
  });
};
