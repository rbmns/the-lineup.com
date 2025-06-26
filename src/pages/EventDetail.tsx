
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useEventAttendees } from '@/hooks/useEventAttendees';
import { useUnifiedRsvp } from '@/hooks/useUnifiedRsvp';
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

  // Enhanced event fetching with RSVP status from cache
  const {
    data: event,
    isLoading,
    error
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      console.log(`Fetching event ${eventId} for detail page`);
      
      // Always check cache first for RSVP status
      let cachedRsvpStatus = null;
      
      if (user?.id) {
        // Check events list cache first
        const eventsListData = queryClient.getQueryData(['events', user.id]);
        if (eventsListData && Array.isArray(eventsListData)) {
          const cachedEvent = eventsListData.find((e: any) => e.id === eventId);
          if (cachedEvent && cachedEvent.rsvp_status !== undefined) {
            cachedRsvpStatus = cachedEvent.rsvp_status;
            console.log(`Found RSVP status in events list cache: ${cachedRsvpStatus}`);
          }
        }
        
        // Also check individual event cache
        const individualEventData = queryClient.getQueryData(['event', eventId]);
        if (individualEventData && (individualEventData as any).rsvp_status !== undefined) {
          cachedRsvpStatus = (individualEventData as any).rsvp_status;
          console.log(`Found RSVP status in individual event cache: ${cachedRsvpStatus}`);
        }
      }
      
      // Fetch fresh event data
      const freshEventData = await fetchEventById(eventId);
      
      if (freshEventData && user?.id) {
        // Use cached RSVP status if available, otherwise use fresh data
        const finalRsvpStatus = cachedRsvpStatus !== null ? cachedRsvpStatus : freshEventData.rsvp_status;
        
        const eventWithRsvp = {
          ...freshEventData,
          rsvp_status: finalRsvpStatus
        };
        
        console.log(`Event ${eventId} detail page - Final RSVP status: ${finalRsvpStatus}`);
        
        // Update cache with the correct RSVP status
        queryClient.setQueryData(['event', eventId], eventWithRsvp);
        
        return eventWithRsvp;
      }
      
      return freshEventData;
    },
    enabled: !!eventId,
    staleTime: 1000 * 10, // 10 seconds
  });

  const {
    attendees,
    loading: attendeesLoading
  } = useEventAttendees(eventId!, {
    enabled: isAuthenticated
  });

  const handleRsvpClick = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!eventId) return false;
    console.log(`RSVP button clicked: ${status} for event ${eventId}`);
    const result = await handleRsvp(eventId, status);
    
    // Force refetch of event data to ensure consistency
    if (result) {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }, 100);
    }
    
    return result;
  };

  if (isLoading) {
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
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{event.title} | the lineup</title>
        <meta name="description" content={event.description || `Join us for ${event.title}`} />
      </Helmet>

      {/* Hero Image Section - Full width */}
      <EventDetailHero event={event} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
