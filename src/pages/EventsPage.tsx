
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { pageSeoTags } from '@/utils/seoUtils';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import { useLocation } from 'react-router-dom';
import { useCanonical } from '@/hooks/useCanonical';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useOptimisticRsvp } from '@/hooks/event-rsvp/useOptimisticRsvp';

const EventsPage = () => {
  // Add canonical URL for SEO - providing the path as required parameter
  useCanonical('/events', pageSeoTags.events.title);
  
  const { user } = useAuth();
  const { data: events = [], isLoading } = useEvents(user?.id);
  const { handleRsvp, loading: rsvpLoading } = useOptimisticRsvp(user?.id);
  
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

  // Pass RSVP handler to event list component using the optimistic RSVP handler
  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user) {
      console.log("User not logged in");
      return false;
    }
    
    try {
      console.log(`EventsPage - RSVP handler called for event: ${eventId}, status: ${status}`);
      
      // Use the optimistic RSVP handler - this won't trigger full page refreshes
      const result = await handleRsvp(eventId, status);
      console.log(`EventsPage - RSVP result:`, result);
      
      return result;
    } catch (error) {
      console.error("Error in EventsPage RSVP handler:", error);
      return false;
    }
  };

  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="What's Happening?" />
        
        <div className="space-y-12 mt-8">
          {/* Events List Section - using the optimistic RSVP handler */}
          <LazyEventsList 
            mainEvents={displayEvents}
            relatedEvents={[]}
            isLoading={isLoading}
            isRsvpLoading={rsvpLoading}
            onRsvp={user ? handleEventRsvp : undefined}
            showRsvpButtons={!!user}
            hasActiveFilters={false}
            compact={true} // Use compact cards for events page
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
