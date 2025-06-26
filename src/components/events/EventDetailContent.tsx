
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <EventDetailHero event={event} />

      {/* Main Content */}
      <div className="w-full px-6 lg:px-12 xl:px-16 py-12 lg:py-16 xl:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-8">
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
            
            {/* Right Column - Event Details Sidebar */}
            <div className="lg:col-span-1">
              <EventDetailSidebar
                event={event}
                attendees={attendees}
                isAuthenticated={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MemoizedEventDetailContent = React.memo(EventDetailContent);
export { MemoizedEventDetailContent as EventDetailContent };
