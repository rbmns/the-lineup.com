import React from 'react';
import { Event } from '@/types';
import { EventDateTimeInfo } from './EventDateTimeInfo';
import { EventLocationInfo } from './EventLocationInfo';
import { EventVenueInfo } from './EventVenueInfo';
import { EventDescription } from './EventDescription';
import { EventOrganizerInfo } from './EventOrganizerInfo';
import { EventCategoryPills } from './EventCategoryPills';
import { EventAdditionalInfo } from './EventAdditionalInfo';
import { EventAttendeesList } from './EventAttendeesList';

export interface EventDetailContentProps {
  event: Event;
  handleEventTypeClick: (eventType: string) => void;
}

export const EventDetailContent: React.FC<EventDetailContentProps> = ({ 
  event,
  handleEventTypeClick
}) => {
  return (
    <div className="space-y-6">
      <EventDateTimeInfo 
        startDate={event.start_time} 
        endDate={event.end_time} 
      />
      
      <EventLocationInfo 
        location={event.location}
        locationCategory={event.location_category}
        latitude={event.location_lat}
        longitude={event.location_long}
      />
      
      <EventVenueInfo venueId={event.venue_id} />
      
      <EventDescription description={event.description} />
      
      <EventOrganizerInfo organizerId={event.organizer_id} />
      
      <EventCategoryPills 
        eventTypes={event.event_types}
        onEventTypeClick={handleEventTypeClick}
      />
      
      <EventAdditionalInfo 
        isFree={event.is_free} 
        isOnline={event.is_online} 
        isFeatured={event.is_featured}
      />
      
      <EventAttendeesList eventId={event.id} />
    </div>
  );
};
