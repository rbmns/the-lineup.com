
import React from 'react';
import { Event } from '@/types';
import { EventDetailHero } from './detail/EventDetailHero';
import { EventDetailMainContent } from './detail/EventDetailMainContent';
import { EventDetailSidebar } from './detail/EventDetailSidebar';

interface EventDetailContentProps {
  event: Event;
  attendees?: { going: any[]; interested: any[] };
  friendAttendees?: { going: any[]; interested: any[] };
  relatedEvents?: Event[];
  relatedLoading?: boolean;
  isAuthenticated?: boolean;
  rsvpLoading?: boolean;
  onRsvp?: (status: 'Going' | 'Interested') => Promise<boolean>;
  isRsvpLoading?: boolean;
  isOwner?: boolean;
}

const EventDetailContent = ({
  event,
  attendees,
  friendAttendees,
  onRsvp,
  isRsvpLoading = false,
  rsvpLoading = false,
  isOwner = false,
}: EventDetailContentProps) => {

  return (
    <div className="min-h-screen bg-pure-white">
      {/* Hero Section */}
      <EventDetailHero event={event} />

      {/* Main Content Area - Apply section-content styling */}
      <div className="section-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column - Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <EventDetailMainContent
              event={event}
              attendees={attendees}
              isAuthenticated={true}
              isOwner={isOwner}
              rsvpLoading={rsvpLoading || isRsvpLoading}
              rsvpFeedback={null}
              onRsvp={onRsvp}
            />
          </div>
          
          {/* Right Column - Event Details Sidebar (1/3 width) */}
          <div className="lg:col-span-1">
            <EventDetailSidebar
              event={event}
              attendees={attendees}
              isAuthenticated={true}
            />
          </div>
        </div>
      </div>

      {/* Related Events Section */}
      <div className="bg-mist-grey/30">
        <div className="section-content">
          <h2 className="text-h2 text-graphite-grey font-montserrat mb-8">Related Events</h2>
          {/* Related events grid would go here */}
          <div className="text-body-base text-graphite-grey">
            Related events will be displayed here.
          </div>
        </div>
      </div>
    </div>
  );
};

export const MemoizedEventDetailContent = React.memo(EventDetailContent);
export { MemoizedEventDetailContent as EventDetailContent };
