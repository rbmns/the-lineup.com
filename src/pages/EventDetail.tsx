import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink, Euro, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { useEventRsvpHandler } from '@/hooks/events/useEventRsvpHandler';
import { EventRsvpSection } from '@/components/events/detail-sections/EventRsvpSection';
import { EventAttendeesList } from '@/components/events/EventAttendeesList';
import { CategoryPill } from '@/components/ui/category-pill';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getEventImage } from '@/utils/eventImages';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEventAttendees } from '@/hooks/useEventAttendees';
import EventShareButton from '@/components/events/EventShareButton';
interface EventDetailProps {
  eventId?: string;
  showBackButton?: boolean;
}
const EventDetail: React.FC<EventDetailProps> = ({
  eventId: propEventId,
  showBackButton = true
}) => {
  const {
    id: paramId
  } = useParams<{
    id: string;
  }>();
  const eventId = propEventId || paramId;
  const {
    user,
    isAuthenticated
  } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
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

  // Fetch attendees only if user is authenticated
  const {
    attendees,
    loading: attendeesLoading
  } = useEventAttendees(eventId!, {
    enabled: isAuthenticated
  });
  const {
    handleRsvp
  } = useEventRsvpHandler(eventId!);

  // Enhanced RSVP handler with visual feedback and cache updates
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

          // Update attendee counts
          if (oldData.attendees) {
            const attendees = {
              ...oldData.attendees
            };

            // Remove from previous status
            if (oldData.rsvp_status === 'Going') {
              attendees.going = Math.max(0, attendees.going - 1);
            } else if (oldData.rsvp_status === 'Interested') {
              attendees.interested = Math.max(0, attendees.interested - 1);
            }

            // Add to new status (if not removing)
            if (newStatus === 'Going') {
              attendees.going += 1;
            } else if (newStatus === 'Interested') {
              attendees.interested += 1;
            }
            updatedEvent.attendees = attendees;
          }
          return updatedEvent;
        });

        // Update the events list cache to reflect RSVP changes
        queryClient.invalidateQueries({
          queryKey: ['events']
        });
        queryClient.invalidateQueries({
          queryKey: ['events', user?.id]
        });
        queryClient.invalidateQueries({
          queryKey: ['event-attendees', eventId]
        });

        // Show success feedback
        toast({
          title: "RSVP updated",
          description: `You are now ${event?.rsvp_status === status ? 'not ' : ''}${status.toLowerCase()} to this event`
        });

        // Clear feedback after animation
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
    return <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>;
  }
  if (error || !event) {
    return <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>;
  }
  const eventLocation = event.venues?.name ? `${event.venues.name}${event.venues.city ? `, ${event.venues.city}` : ''}` : event.location || 'Location TBD';
  const isOwner = user?.id === event.creator?.id;

  // Get event image with fallback
  const eventImage = getEventImage(event);

  // FIXED: Get proper Google Maps URL
  const getGoogleMapsUrl = () => {
    // First priority: use venue's direct Google Maps URL
    if (event.venues?.google_maps) {
      console.log('Using venue Google Maps URL:', event.venues.google_maps);
      return event.venues.google_maps;
    }

    // Second priority: create search URL from venue details
    if (event.venues) {
      const searchQuery = [event.venues.name, event.venues.street, event.venues.city, event.venues.postal_code].filter(Boolean).join(', ');
      if (searchQuery) {
        const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
        console.log('Generated Google Maps search URL:', searchUrl);
        return searchUrl;
      }
    }

    // Fallback: use event location
    if (event.location) {
      const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
      console.log('Using fallback location URL:', fallbackUrl);
      return fallbackUrl;
    }
    return null;
  };
  const googleMapsUrl = getGoogleMapsUrl();
  return <div className="min-h-screen bg-white">
      <Helmet>
        <title>{event.title} | the lineup</title>
        <meta name="description" content={event.description || `Join us for ${event.title}`} />
      </Helmet>

      {/* Hero Image Section - Full width */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96">
        <img src={eventImage} alt={event.title} className="w-full h-full object-cover" onError={e => {
        const target = e.target as HTMLImageElement;
        if (!target.src.includes('default.jpg')) {
          target.src = 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg';
        }
      }} />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Category pill on image */}
        {event.event_category && <div className="absolute top-4 left-4">
            <CategoryPill category={event.event_category} size="sm" showIcon={true} />
          </div>}
        
        {/* Share button - Top right */}
        <div className="absolute top-4 right-4">
          <EventShareButton event={event} variant="outline" />
        </div>
        
        {/* Event title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 text-left">{event.title}</h1>
          <div className="flex items-center text-white/90 text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {event.start_date && formatDate(event.start_date)}
              {event.start_time && `, ${formatEventTime(event.start_time, event.end_time)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* RSVP Section - only show if authenticated */}
            {isAuthenticated && <div className={`transition-all duration-300 ${rsvpFeedback ? 'scale-105' : ''} ${rsvpFeedback === 'going' ? 'ring-2 ring-green-200' : rsvpFeedback === 'interested' ? 'ring-2 ring-blue-200' : ''}`}>
                <EventRsvpSection isOwner={isOwner} onRsvp={handleRsvpWithFeedback} isRsvpLoading={rsvpLoading} currentStatus={event.rsvp_status} />
              </div>}

            {/* About this event */}
            <div className="text-left">
              <h2 className="text-xl font-semibold mb-4 text-left">About this event</h2>
              <div className="prose prose-sm max-w-none text-left">
                <p className="whitespace-pre-line text-left">{event.description || ''}</p>
              </div>
            </div>

            {/* Additional Info */}
            {event.extra_info && <div className="text-left">
                <h2 className="text-xl font-semibold mb-4 text-left">Additional Information</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-left">{event.extra_info}</p>
              </div>}

            {/* Attendees - only show if authenticated */}
            {isAuthenticated && attendees && (attendees.going.length > 0 || attendees.interested.length > 0) && <div className="text-left">
                <h2 className="text-xl font-semibold mb-4 text-left">Friends Attending</h2>
                <div className="space-y-4">
                  {attendees.going.length > 0 && <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2 text-left">Going: {attendees.going.length}</h3>
                      <div className="flex flex-wrap gap-2">
                        {attendees.going.map(attendee => <Link key={attendee.id} to={`/profile/${attendee.id}`} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition-colors">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                              {attendee.username?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm">{attendee.username}</span>
                          </Link>)}
                      </div>
                    </div>}
                  
                  {attendees.interested.length > 0 && <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2 text-left">Interested: {attendees.interested.length}</h3>
                      <div className="flex flex-wrap gap-2">
                        {attendees.interested.map(attendee => <Link key={attendee.id} to={`/profile/${attendee.id}`} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition-colors">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                              {attendee.username?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm">{attendee.username}</span>
                          </Link>)}
                      </div>
                    </div>}
                </div>
              </div>}

            {/* Hosted by */}
            {event.organiser_name && <div className="text-left">
                <h2 className="text-xl font-semibold mb-4 text-left">Hosted by</h2>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {event.organiser_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-left">{event.organiser_name}</p>
                    <p className="text-sm text-gray-600 text-left">Event Organizer</p>
                  </div>
                </div>
              </div>}
          </div>

          {/* Right Column - Event Details */}
          <div className="space-y-4">
            {/* Location */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 mb-1 text-left">Location</h3>
                    <p className="text-sm text-gray-600 text-left">{eventLocation}</p>
                    {googleMapsUrl && <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline" onClick={e => {
                    console.log('Google Maps link clicked from sidebar:', googleMapsUrl);
                    // The link will open normally, this is just for debugging
                  }}>
                        View on map
                      </a>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Info */}
            {event.fee && <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Euro className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 mb-1 text-left">Booking Info</h3>
                      <p className="text-sm text-gray-600 mb-2 text-left">Entry fee</p>
                      <p className="font-medium text-left">€{event.fee}</p>
                      {event.organizer_link && <Button variant="link" className="p-0 h-auto text-sm text-blue-600 mt-2" asChild>
                          <a href={event.organizer_link} target="_blank" rel="noopener noreferrer">
                            Organizer website
                          </a>
                        </Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>}

            {/* Attendee Summary - only show if authenticated */}
            {isAuthenticated && <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="w-full text-left">
                      <h3 className="font-medium text-gray-900 mb-3 text-left">Attendees</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Going</span>
                          <span className="text-sm font-medium">{attendees?.going?.length || 0}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Interested</span>
                          <span className="text-sm font-medium">{attendees?.interested?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>}
          </div>
        </div>

        {/* Back to Events button at bottom */}
        {showBackButton && <div className="mt-12 pt-8 border-t border-gray-200">
            <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </div>}
      </div>
    </div>;
};
export default EventDetail;