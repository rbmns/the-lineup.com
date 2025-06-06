import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { useEventRsvpHandler } from '@/hooks/events/useEventRsvpHandler';
import { EventRsvpSection } from '@/components/events/detail-sections/EventRsvpSection';
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
        <div className="max-w-4xl mx-auto px-6 py-8">
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
        <div className="max-w-4xl mx-auto px-6 py-8">
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        {showBackButton && (
          <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        )}

        {/* Event Header */}
        <div className="mb-8">
          <img 
            src={eventImage} 
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('default.jpg')) {
                target.src = 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg';
              }
            }}
          />
          
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {event.start_date && formatDate(event.start_date)}
                {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{eventLocation}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>
                {event.attendees?.going || 0} going, {event.attendees?.interested || 0} interested
              </span>
            </div>
          </div>

          {event.event_category && (
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-6">
              {event.event_category}
            </span>
          )}
        </div>

        {/* RSVP Section with enhanced feedback */}
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

        {/* Mobile attendees info - only show on mobile when no social sidebar */}
        {isMobile && (
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Who's Going</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Going</span>
                <span className="font-medium">{event.attendees?.going || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Interested</span>
                <span className="font-medium">{event.attendees?.interested || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Event Description */}
        {event.description && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* Additional Info */}
        {event.extra_info && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.extra_info}</p>
          </div>
        )}

        {/* Fee Information */}
        {event.fee && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cost</h2>
            <p className="text-gray-700">€{event.fee}</p>
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

        {/* Creator Info */}
        {event.creator && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Organized by</h2>
            <div className="flex items-center gap-3">
              {event.creator.avatar_url && event.creator.avatar_url.length > 0 && (
                <img 
                  src={event.creator.avatar_url[0]} 
                  alt={event.creator.username || 'Organizer'}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{event.organiser_name || event.creator.username}</p>
                {event.creator.tagline && (
                  <p className="text-gray-600 text-sm">{event.creator.tagline}</p>
                )}
                {event.organizer_link && (
                  <a 
                    href={event.organizer_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1 mt-1"
                  >
                    Visit organizer page
                    <ExternalLink className="h-3 w-3" />
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
