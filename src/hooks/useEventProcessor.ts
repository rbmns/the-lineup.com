
import { Event, UserProfile, Venue } from '@/types';

export const useEventProcessor = () => {
  const processEvent = (eventData: any, userId?: string): Event => {
    // Safely process creator data
    const creatorProfile = eventData.creator && eventData.creator.length > 0 
      ? eventData.creator[0] as UserProfile
      : null;

    // Safely process venue data
    let venueData: Venue | null = null;
    if (eventData.venues && 
        typeof eventData.venues === 'object' && 
        eventData.venues !== null && 
        !Array.isArray(eventData.venues)) {
      venueData = eventData.venues as Venue;
    }

    // Process RSVP data
    let rsvpStatus: 'Going' | 'Interested' | null = null;
    const goingCount = eventData.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going')?.length || 0;
    const interestedCount = eventData.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested')?.length || 0;

    if (userId && eventData.event_rsvps) {
      const userRsvp = eventData.event_rsvps.find((rsvp: any) => rsvp.user_id === userId);
      if (userRsvp) {
        rsvpStatus = userRsvp.status as 'Going' | 'Interested';
      }
    }

    return {
      id: eventData.id,
      title: eventData.title,
      description: eventData.description || '',
      location: eventData.location,
      event_category: eventData.event_category,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      created_at: eventData.created_at,
      updated_at: eventData.updated_at,
      image_urls: eventData.image_urls || [],
      attendees: {
        going: goingCount,
        interested: interestedCount
      },
      rsvp_status: rsvpStatus,
      area: eventData.area,
      google_maps: venueData?.google_maps || eventData.google_maps,
      organizer_link: eventData.organizer_link,
      organiser_name: eventData.organiser_name,
      booking_link: eventData.booking_link,
      creator: creatorProfile,
      venues: venueData,
      venue_id: eventData.venue_id,
      fee: eventData.fee,
      extra_info: eventData.extra_info,
      tags: eventData.tags ? (typeof eventData.tags === 'string' ? [eventData.tags] : eventData.tags) : [],
      coordinates: eventData.coordinates,
      created_by: eventData.created_by,
      vibe: eventData.vibe,
      unique_id: eventData.unique_id,
      slug: eventData.slug,
      destination: eventData.destination,
      recurring_count: eventData.recurring_count,
      cover_image: eventData.cover_image,
      share_image: eventData.share_image,
      going_count: goingCount,
      interested_count: interestedCount
    } as Event;
  };

  return { processEvent };
};
