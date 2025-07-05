
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useEventAttendees } from '@/hooks/useEventAttendees';
import { useUnifiedRsvp } from '@/hooks/useUnifiedRsvp';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { EventDetailHero } from '@/components/events/detail/EventDetailHero';
import { EventDetailMainContent } from '@/components/events/detail/EventDetailMainContent';
import { EventDetailSidebar } from '@/components/events/detail/EventDetailSidebar';

interface EventDetailProps {
  eventId?: string;
  showBackButton?: boolean;
}

const EventDetail: React.FC<EventDetailProps> = ({
  eventId: propEventId,
  showBackButton = true
}) => {
  const { id: paramId } = useParams<{ id: string }>();
  const eventId = propEventId || paramId;
  const { user, isAuthenticated } = useAuth();
  const { handleRsvp, loadingEventId } = useUnifiedRsvp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getFilteredEventsPath, hasFilteredEventsHistory } = useNavigationHistory();

  console.log('EventDetail - eventId:', eventId, 'user:', user?.id);

  // Simplified event fetching - let the service handle RSVP status properly
  const {
    data: event,
    isLoading,
    error
  } = useQuery({
    queryKey: ['event', eventId, user?.id],
    queryFn: async () => {
      if (!eventId) {
        console.error('EventDetail: No eventId provided');
        return null;
      }
      
      console.log(`Fetching event ${eventId} for detail page with user ${user?.id}`);
      
      // Fetch event data with proper RSVP filtering
      const eventData = await fetchEventById(eventId, user?.id);
      
      if (eventData) {
        console.log(`Event ${eventId} detail page - RSVP status: ${eventData.rsvp_status}`);
        console.log('Event data loaded:', eventData);
      } else {
        console.error(`No event data returned for ID: ${eventId}`);
      }
      
      return eventData;
    },
    enabled: !!eventId,
    staleTime: 1000 * 10, // 10 seconds
    retry: (failureCount, error) => {
      console.error(`Event fetch attempt ${failureCount + 1} failed:`, error);
      return failureCount < 2; // Retry up to 2 times
    },
  });

  // Set up meta tags for sharing
  useEventMetaTags(event);

  const {
    attendees,
    loading: attendeesLoading
  } = useEventAttendees(eventId!, {
    enabled: isAuthenticated && !!eventId
  });

  const handleRsvpClick = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!eventId) return false;
    console.log(`RSVP button clicked: ${status} for event ${eventId}, current status: ${event?.rsvp_status}`);
    const result = await handleRsvp(eventId, status);
    console.log(`RSVP operation result: ${result}`);
    
    // If successful, invalidate relevant caches to ensure fresh data
    if (result) {
      console.log('RSVP success, invalidating caches');
      
      // Invalidate the specific event cache
      queryClient.invalidateQueries({ 
        queryKey: ['event', eventId] 
      });
      
      // Also invalidate event attendees cache
      queryClient.invalidateQueries({ 
        queryKey: ['event-attendees', eventId] 
      });
      
      // Invalidate events list caches to ensure consistency across pages
      queryClient.invalidateQueries({ 
        queryKey: ['events'] 
      });
    }
    
    return result;
  };

  if (isLoading) {
    console.log('EventDetail - Loading event data...');
    return (
      <div className="min-h-screen bg-pure-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-mist-grey rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-mist-grey rounded mb-6"></div>
            <div className="h-6 bg-mist-grey rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-mist-grey rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-mist-grey rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    console.error('EventDetail - Error or no event:', error, 'eventId:', eventId);
    return (
      <div className="min-h-screen bg-pure-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-graphite-grey mb-4">Event Not Found</h1>
            <p className="text-graphite-grey/70 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => {
                const filteredPath = hasFilteredEventsHistory() ? getFilteredEventsPath() : '/events';
                navigate(filteredPath);
              }}
              className="btn-primary"
            >
              Browse Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === event.creator?.id;

  console.log(`EventDetail rendering - Event RSVP status: ${event.rsvp_status}`);

  return (
    <div className="min-h-screen bg-pure-white">
      <Helmet>
        <title>{event.title} | the lineup</title>
        <meta name="description" content={event.description || `Join us for ${event.title}`} />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.description || `Join us for ${event.title}`} />
        <meta property="og:image" content={event.image_urls?.[0] || 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg'} />
        <meta property="og:url" content={`${window.location.origin}/events/${event.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={event.title} />
        <meta name="twitter:description" content={event.description || `Join us for ${event.title}`} />
        <meta name="twitter:image" content={event.image_urls?.[0] || 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg'} />
      </Helmet>

      {/* Hero Image Section - Full width */}
      <EventDetailHero event={event} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-pure-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <EventDetailMainContent
            event={event}
            attendees={attendees}
            isAuthenticated={isAuthenticated}
            isOwner={isOwner}
            rsvpLoading={loadingEventId === eventId}
            rsvpFeedback={null}
            onRsvp={handleRsvpClick}
          />

          {/* Right Column - Event Details */}
          <div className="lg:col-span-1">
            <EventDetailSidebar
              event={event}
              attendees={attendees}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>

        {/* Back to Events button at bottom */}
        {showBackButton && (
          <div className="mt-12 pt-8 border-t border-mist-grey">
            <button
              onClick={() => {
                const filteredPath = hasFilteredEventsHistory() ? getFilteredEventsPath() : '/events';
                navigate(filteredPath);
              }}
              className="inline-flex items-center text-horizon-blue hover:text-graphite-grey transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
