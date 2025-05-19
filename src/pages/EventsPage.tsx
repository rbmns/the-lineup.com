
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { filterUpcomingEvents } from '@/utils/date-filtering';
import { pageSeoTags } from '@/utils/seoUtils';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { useCanonical } from '@/hooks/useCanonical';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useEnhancedRsvp } from '@/hooks/events/useEnhancedRsvp';
import { useRsvpHandler } from '@/hooks/events/useRsvpHandler';
import { useQueryClient } from '@tanstack/react-query';
import { EventCountDisplay } from '@/components/events/EventCountDisplay';

const EventsPage = () => {
  // Add canonical URL for SEO - providing the path as required parameter
  useCanonical('/events', pageSeoTags.events.title);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: events = [], isLoading, refetch } = useEvents(user?.id);
  const { handleRsvp, loadingEventId } = useEnhancedRsvp(user?.id);
  const rsvpInProgressRef = useRef(false);
  
  // Use the optimized RSVP handler with proper event handling
  const { handleEventRsvp } = useRsvpHandler(user, handleRsvp, rsvpInProgressRef);
  
  // Force refetch when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);
  
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
  
  // Get count for the EventCountDisplay component
  const eventsCount = displayEvents.length;

  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="Upcoming Events" />
        
        <EventCountDisplay count={eventsCount} />
        
        <div className="space-y-8 mt-8">
          <LazyEventsList 
            mainEvents={displayEvents}
            relatedEvents={[]}
            isLoading={isLoading}
            onRsvp={user ? handleEventRsvp : undefined}
            showRsvpButtons={!!user}
            hasActiveFilters={false}
            compact={false}
            loadingEventId={loadingEventId}
            hideCount={true} // Add this prop to hide the count in LazyEventsList
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
