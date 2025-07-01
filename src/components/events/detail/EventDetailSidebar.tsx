
import React from 'react';
import { Event } from '@/types';
import { EventDateTimeSection } from '@/components/events/detail-sections/EventDateTimeSection';
import { EventLocationSection } from '@/components/events/detail-sections/EventLocationSection';
import { EventAttendeesSummary } from '@/components/events/detail-sections/EventAttendeesSummary';
import { EventExternalLink } from '@/components/events/detail-sections/EventExternalLink';
import { EventTagsSection } from '@/components/events/detail-sections/EventTagsSection';

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
          coordinates={event.coordinates ? { latitude: event.coordinates[0], longitude: event.coordinates[1] } : null}
          title={event.title}
        />
      </div>

      {/* Attendees Summary */}
      {isAuthenticated && attendees && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <EventAttendeesSummary
            goingCount={attendees.going.length}
            interestedCount={attendees.interested.length}
          />
        </div>
      )}

      {/* External Link */}
      {event.organizer_link && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <EventExternalLink url={event.organizer_link} />
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
