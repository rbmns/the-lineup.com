
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { usePreservedRsvp } from '@/hooks/usePreservedRsvp';
import { useEventListState } from '@/hooks/events/useEventListState';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { useRsvpHandler } from '@/hooks/events/useRsvpHandler';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { Event } from '@/types';

const EventsPageRefactored = () => {
  // Apply meta tags and canonical URL
  useEventPageMeta();
  
  const { user } = useAuth();
  const { data: events = [], isLoading } = useEvents(user?.id);
  const { handleRsvp, loading: rsvpLoading } = usePreservedRsvp(user?.id);
  
  // Get state management hooks
  const { 
    rsvpInProgressRef 
  } = useEventListState();
  
  // Handle RSVP actions
  const { handleEventRsvp } = useRsvpHandler(user, handleRsvp, rsvpInProgressRef);

  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="What's Happening?" />
        
        <div className="space-y-8 mt-8">
          {/* Events List Section - simplified without filters */}
          <LazyEventsList 
            mainEvents={events}
            relatedEvents={[]}
            isLoading={isLoading}
            isRsvpLoading={rsvpLoading}
            onRsvp={user ? handleEventRsvp : undefined}
            showRsvpButtons={!!user}
            hasActiveFilters={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPageRefactored;
