
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useEventAttendees } from '@/hooks/useEventAttendees';
import { useUnifiedRsvp } from '@/hooks/useUnifiedRsvp';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { EventDetailContent } from '@/components/events/EventDetailContent';

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

  console.log('EventDetail - eventId:', eventId, 'user:', user?.id);

  // Fetch event data
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
      return failureCount < 2;
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
    return result;
  };

  if (isLoading) {
    console.log('EventDetail - Loading event data...');
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    console.error('EventDetail - Error or no event:', error, 'eventId:', eventId);
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === event.creator?.id;

  console.log(`EventDetail rendering - Event RSVP status: ${event.rsvp_status}`);

  return (
    <>
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

      <EventDetailContent
        event={event}
        attendees={attendees}
        isAuthenticated={isAuthenticated}
        rsvpLoading={loadingEventId === eventId}
        onRsvp={handleRsvpClick}
        isOwner={isOwner}
      />

      {/* Back to Events button at bottom */}
      {showBackButton && (
        <div className="bg-pure-white">
          <div className="section-content">
            <div className="pt-8 border-t border-mist-grey">
              <Link to="/events" className="inline-flex items-center text-ocean-teal hover:text-ocean-teal/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetail;
