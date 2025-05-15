
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { pageSeoTags } from '@/utils/seoUtils';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { useCanonical } from '@/hooks/useCanonical';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useOptimisticRsvp } from '@/hooks/event-rsvp/useOptimisticRsvp';

const EventsPage = () => {
  // Add canonical URL for SEO - providing the path as required parameter
  useCanonical('/events', pageSeoTags.events.title);
  
  const { user } = useAuth();
  const { data: events = [], isLoading } = useEvents(user?.id);
  const { handleRsvp, rsvpInProgress } = useOptimisticRsvp(user?.id);
  const rsvpInProgressRef = useRef(false);
  
  // Set page metadata
  useEffect(() => {
    document.title = pageSeoTags.events.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.events.description);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageSeoTags.events.title);
    if (ogDesc) ogDesc.setAttribute('content', pageSeoTags.events.description);
  }, []);

  // Process events - just filter for upcoming events, no category filters
  const displayEvents = filterUpcomingEvents(events || []);

  // Use the optimistic RSVP handler with proper event handling
  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user || rsvpInProgressRef.current) {
      return false;
    }
    
    try {
      rsvpInProgressRef.current = true;
      return await handleRsvp(eventId, status);
    } finally {
      // Reset the in-progress flag after a delay
      setTimeout(() => {
        rsvpInProgressRef.current = false;
      }, 300);
    }
  };

  return (
    <div className="w-full px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="Upcoming Events" />
        
        <div className="space-y-6 mt-6">
          {/* Events List Section - grid view only now */}
          <LazyEventsList 
            mainEvents={displayEvents}
            relatedEvents={[]}
            isLoading={isLoading}
            isRsvpLoading={rsvpInProgress}
            onRsvp={user ? handleEventRsvp : undefined}
            showRsvpButtons={!!user}
            hasActiveFilters={false}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
