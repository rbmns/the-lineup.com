
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useEventRsvpHandler } from '@/hooks/events/useEventRsvpHandler';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useEventAttendees } from '@/hooks/useEventAttendees';
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
  const queryClient = useQueryClient();
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpFeedback, setRsvpFeedback] = useState<'going' | 'interested' | null>(null);

  const {
    data: event,
    isLoading,
    error
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId!),
    enabled: !!eventId
  });

  const {
    attendees,
    loading: attendeesLoading
  } = useEventAttendees(eventId!, {
    enabled: isAuthenticated
  });

  const { handleRsvp } = useEventRsvpHandler(eventId!);

  const handleRsvpWithFeedback = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to RSVP to events",
        variant: "destructive"
      });
      return false;
    }

    setRsvpLoading(true);
    setRsvpFeedback(status.toLowerCase() as 'going' | 'interested');

    try {
      const result = await handleRsvp(status);
      if (result) {
        // Update the event detail cache immediately
        queryClient.setQueryData(['event', eventId], (oldData: any) => {
          if (!oldData) return oldData;
          const newStatus = oldData.rsvp_status === status ? null : status;
          const updatedEvent = {
            ...oldData,
            rsvp_status: newStatus
          };

          if (oldData.attendees) {
            const attendees = { ...oldData.attendees };

            if (oldData.rsvp_status === 'Going') {
              attendees.going = Math.max(0, attendees.going - 1);
            } else if (oldData.rsvp_status === 'Interested') {
              attendees.interested = Math.max(0, attendees.interested - 1);
            }

            if (newStatus === 'Going') {
              attendees.going += 1;
            } else if (newStatus === 'Interested') {
              attendees.interested += 1;
            }
            updatedEvent.attendees = attendees;
          }
          return updatedEvent;
        });

        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['events', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });

        toast({
          title: "RSVP updated",
          description: `You are now ${event?.rsvp_status === status ? 'not ' : ''}${status.toLowerCase()} to this event`
        });

        setTimeout(() => setRsvpFeedback(null), 1000);
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to update RSVP. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('RSVP error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setRsvpLoading(false);
    }
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
            rsvpLoading={rsvpLoading}
            rsvpFeedback={rsvpFeedback}
            onRsvp={handleRsvpWithFeedback}
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
