
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
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{event.title} | the lineup</title>
        <meta name="description" content={event.description || `Join us for ${event.title}`} />
      </Helmet>

      {/* Hero Image Section - Full width */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96">
        <img 
          src={eventImage} 
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('default.jpg')) {
              target.src = 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg';
            }
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Top navigation overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between">
          {showBackButton && (
            <Link to="/events" className="inline-flex items-center text-white hover:text-gray-200 bg-black/20 backdrop-blur-sm rounded-full px-3 py-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          )}
          <Button variant="ghost" size="sm" className="text-white hover:text-gray-200 bg-black/20 backdrop-blur-sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        
        {/* Category pill on image */}
        {event.event_category && (
          <div className="absolute top-20 left-4 sm:left-6">
            <CategoryPill 
              category={event.event_category}
              size="sm"
              showIcon={true}
            />
          </div>
        )}
        
        {/* Event title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{event.title}</h1>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* RSVP Section - only show if authenticated */}
            {user && (
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
            )}

            {/* About this event */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this event</h2>
              <EventDescriptionSection description={event.description || ''} />
            </div>

            {/* Additional Info */}
            {event.extra_info && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.extra_info}</p>
              </div>
            )}

            {/* Hosted by */}
            {event.organiser_name && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Hosted by</h2>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {event.organiser_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{event.organiser_name}</p>
                    <p className="text-sm text-gray-600">Event Organizer</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Event Details */}
          <div className="space-y-4">
            {/* Location */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                    <p className="text-sm text-gray-600">{eventLocation}</p>
                    <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                      View on map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Info */}
            {event.fee && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Euro className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Booking Info</h3>
                      <p className="text-sm text-gray-600 mb-2">Entry fee</p>
                      <p className="font-medium">€{event.fee}</p>
                      {event.organizer_link && (
                        <Button variant="link" className="p-0 h-auto text-sm text-blue-600 mt-2" asChild>
                          <a href={event.organizer_link} target="_blank" rel="noopener noreferrer">
                            Organizer website
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
            </Card>
            )}

            {/* Friends Attending */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="w-full">
                    <h3 className="font-medium text-gray-900 mb-3">Friends Attending</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Going</span>
                        <span className="text-sm font-medium">3</span>
                      </div>
                      
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <p>Going: 3</p>
                        <p>Interested: 0</p>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full text-sm">
                        See all attendees
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
