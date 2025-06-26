
import React, { useMemo, useCallback, useState, useEffect } from 'react';
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
  // Local state to track RSVP status for immediate UI updates
  const [currentRsvpStatus, setCurrentRsvpStatus] = useState<'Going' | 'Interested' | null>(event.rsvp_status);

  // Update local state when event prop changes
  useEffect(() => {
    setCurrentRsvpStatus(event.rsvp_status);
  }, [event.rsvp_status]);

  const handleRsvp = useCallback(async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      console.log(`EventDetailContent: Current RSVP status before handling: ${currentRsvpStatus}, handling: ${status}`);
      
      // Optimistically update the UI
      const newStatus = currentRsvpStatus === status ? null : status;
      setCurrentRsvpStatus(newStatus);
      
      const result = await onRsvp(status);
      
      // If the RSVP failed, revert the optimistic update
      if (!result) {
        setCurrentRsvpStatus(currentRsvpStatus);
      }
      
      return result;
    } catch (error) {
      console.error('RSVP error:', error);
      // Revert optimistic update on error
      setCurrentRsvpStatus(currentRsvpStatus);
      return false;
    }
  }, [onRsvp, currentRsvpStatus]);

  // Create an event object with updated RSVP status for passing to child components
  const eventWithUpdatedRsvp = useMemo(() => ({
    ...event,
    rsvp_status: currentRsvpStatus
  }), [event, currentRsvpStatus]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <EventDetailHero event={eventWithUpdatedRsvp} />

      {/* Main Content */}
      <div className="w-full px-6 lg:px-12 xl:px-16 py-12 lg:py-16 xl:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-8">
              <EventDetailMainContent
                event={eventWithUpdatedRsvp}
                attendees={attendees}
                isAuthenticated={true}
                isOwner={isOwner}
                rsvpLoading={rsvpLoading || isRsvpLoading}
                rsvpFeedback={null}
                onRsvp={handleRsvp}
              />
            </div>
            
            {/* Right Column - Event Details Sidebar */}
            <div className="lg:col-span-1">
              <EventDetailSidebar
                event={eventWithUpdatedRsvp}
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
