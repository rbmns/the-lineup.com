
import React from 'react';
import { Event } from '@/types';
import { EventDateTimeSection } from '@/components/events/detail-sections/EventDateTimeSection';
import { EventLocationSection } from '@/components/events/detail-sections/EventLocationSection';
import { EventAttendeesSummary } from '@/components/events/detail-sections/EventAttendeesSummary';
import { EventExternalLink } from '@/components/events/detail-sections/EventExternalLink';
import { EventTagsSection } from '@/components/events/detail-sections/EventTagsSection';
import { EventOrganizerSection } from '@/components/events/detail-sections/EventOrganizerSection';
import { EventBookingSection } from '@/components/events/detail-sections/EventBookingSection';

interface EventDetailSidebarProps {
  event: Event;
  attendees?: {
    going: any[];
    interested: any[];
  };
  isAuthenticated: boolean;
}

export const EventDetailSidebar: React.FC<EventDetailSidebarProps> = ({
  event,
  attendees,
  isAuthenticated
}) => {
  return (
    <div className="space-y-6">
      {/* Date and Time Section with Local Time Display */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <EventDateTimeSection
          startDateTime={event.start_datetime}
          endDateTime={event.end_datetime}
          timezone={event.timezone}
          city={event.venues?.city}
        />
      </div>

      {/* Location Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <EventLocationSection 
          venue={event.venues}
          location={event.location}
          destination={event.destination}
          coordinates={event.coordinates ? { latitude: event.coordinates[0], longitude: event.coordinates[1] } : null}
          title={event.title}
          venueName={(event as any).venue_name}
          address={(event as any).address}
          googleMaps={(event as any).google_maps}
        />
      </div>

      {/* Organizer Section */}
      {event.organiser_name && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <EventOrganizerSection 
            organizerName={event.organiser_name}
            organizerLink={event.organizer_link}
            eventId={event.id}
            eventTitle={event.title}
          />
        </div>
      )}

      {/* Booking Information Section */}
      {(event.fee || event.booking_link) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <EventBookingSection 
            fee={event.fee}
            bookingLink={event.booking_link}
            eventId={event.id}
            eventTitle={event.title}
          />
        </div>
      )}

      {/* Attendees Summary */}
      {isAuthenticated && attendees && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <EventAttendeesSummary
            goingCount={attendees.going.length}
            interestedCount={attendees.interested.length}
          />
        </div>
      )}

      {/* Tags Section */}
      {event.tags && event.tags.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <EventTagsSection tags={event.tags} />
        </div>
      )}
    </div>
  );
};
