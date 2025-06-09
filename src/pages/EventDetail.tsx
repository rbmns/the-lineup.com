
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { useEventRsvpHandler } from '@/hooks/events/useEventRsvpHandler';
import { EventRsvpSection } from '@/components/events/detail-sections/EventRsvpSection';
import { EventDescriptionSection } from '@/components/events/detail-sections/EventDescriptionSection';
import { EventAttendeesSummary } from '@/components/events/detail-sections/EventAttendeesSummary';
import { CategoryPill } from '@/components/ui/category-pill';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getEventImage } from '@/utils/eventImages';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpFeedback, setRsvpFeedback] = useState<'going' | 'interested' | null>(null);
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId!),
    enabled: !!eventId,
  });

  const { handleRsvp } = useEventRsvpHandler(eventId!);

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
          const updatedEvent = { ...oldData, rsvp_status: newStatus };
          
          // Update attendee counts
          if (oldData.attendees) {
            const attendees = { ...oldData.attendees };
            
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
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['events', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
        
        // Show success feedback
        toast({
          title: "RSVP updated",
          description: `You are now ${event?.rsvp_status === status ? 'not ' : ''}${status.toLowerCase()} to this event`,
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
          {showBackButton && (
            <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          )}
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

  const eventLocation = event.venues?.name ? 
    `${event.venues.name}${event.venues.city ? `, ${event.venues.city}` : ''}` : 
    event.location || 'Location TBD';

  const isOwner = user?.id === event.creator?.id;
  
  // Get event image with fallback
  const eventImage = getEventImage(event);

  return (
    <div className="min-h-screen bg-white event-detail-card">
      <Helmet>
        <title>{event.title} | the lineup</title>
        <meta name="description" content={event.description || `Join us for ${event.title}`} />
      </Helmet>

      {/* Full width container with proper mobile padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {showBackButton && (
          <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        )}

        {/* Event Header */}
        <div className="mb-8 relative">
          <div className="relative">
            <img 
              src={eventImage} 
              alt={event.title}
              className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg mb-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('default.jpg')) {
                  target.src = 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg';
                }
              }}
            />
            
            {/* Category pill on top of image */}
            {event.event_category && (
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <CategoryPill 
                  category={event.event_category}
                  size="sm"
                  showIcon={true}
                />
              </div>
            )}
          </div>
          
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-left break-words">{event.title}</h1>
          
          {/* Event Details Cards - Responsive grid */}
          <div className="grid gap-3 sm:gap-4 mb-6">
            {/* Date & Time Card */}
            <Card className="bg-gray-50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Date & Time</h3>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      {event.start_date && formatDate(event.start_date)}
                      {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="bg-gray-50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Venue</h3>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{eventLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entrance Fee Card - only show if fee exists */}
            {event.fee && (
              <Card className="bg-gray-50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <Euro className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">Entrance Fee</h3>
                      <p className="text-xs sm:text-sm text-gray-600">€{event.fee}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attendees Card */}
            <Card className="bg-gray-50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Who's going</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {event.attendees?.going || 0} going, {event.attendees?.interested || 0} interested
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RSVP Section - only show for authenticated users */}
        {user && (
          <div className="mb-8">
            <div className={`transition-all duration-300 ${rsvpFeedback ? 'scale-105' : ''} ${
              rsvpFeedback === 'going' ? 'ring-2 ring-green-200' : 
              rsvpFeedback === 'interested' ? 'ring-2 ring-blue-200' : ''
            }`}>
              <EventRsvpSection
                isOwner={isOwner}
                onRsvp={handleRsvpWithFeedback}
                isRsvpLoading={rsvpLoading}
                currentStatus={event.rsvp_status}
              />
            </div>
          </div>
        )}

        {/* Event Description */}
        {event.description && (
          <div className="mb-8">
            <EventDescriptionSection description={event.description} />
          </div>
        )}

        {/* Additional Info */}
        {event.extra_info && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Additional Information</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{event.extra_info}</p>
          </div>
        )}

        {/* Organizer Link */}
        {event.organizer_link && (
          <div className="mb-8">
            <Button asChild className="inline-flex items-center gap-2">
              <a href={event.organizer_link} target="_blank" rel="noopener noreferrer">
                Get Tickets / More Info
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}

        {/* Organizer Info - only show if organiser_name exists */}
        {event.organiser_name && (
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Organized by</h2>
            <div className="flex items-center gap-3">
              <div className="min-w-0">
                <p className="font-medium break-words">{event.organiser_name}</p>
                {event.organizer_link && (
                  <a 
                    href={event.organizer_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1 mt-1 break-all"
                  >
                    Visit organizer page
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
