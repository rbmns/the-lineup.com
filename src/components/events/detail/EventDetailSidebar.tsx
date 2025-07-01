
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
          startTime={event.start_time}
          endTime={event.end_time}
          startDate={event.start_date}
          timezone={event.timezone}
          city={event.venues?.city}
        />
      </div>

      {/* Location Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <EventLocationSection event={event} />
      </div>

      {/* Attendees Summary */}
      {isAuthenticated && attendees && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <EventAttendeesSummary
            attendees={attendees}
            eventId={event.id}
          />
        </div>
      )}

      {/* External Link */}
      {event.external_link && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <EventExternalLink url={event.external_link} />
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
