
import React from 'react';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useAuth } from '@/contexts/AuthContext';
import { X, Calendar, MapPin, Ticket, Globe, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryPill } from '@/components/ui/category-pill';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { LineupImage } from '@/components/ui/lineup-image';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

interface EventSidePanelProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventSidePanel: React.FC<EventSidePanelProps> = ({
  eventId,
  isOpen,
  onClose
}) => {
  const { isAuthenticated, user } = useAuth();
  const { event, loading, error } = useEventDetails(eventId, user?.id);
  const { handleRsvp, loading: rsvpLoading } = useRsvpActions(user?.id);
  const queryClient = useQueryClient();

  const handleRsvpClick = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!event) return false;
    try {
      const result = await handleRsvp(event.id, status);
      if (result) {
        // Invalidate and refetch the event details to update the UI
        queryClient.invalidateQueries({
          queryKey: ['event-details', event.id]
        });
      }
      return result;
    } catch (error) {
      console.error('Error handling RSVP:', error);
      return false;
    }
  };

  if (!isOpen || !eventId) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-0 bottom-0 w-full sm:w-[480px] sm:right-80 sm:top-16 bg-white shadow-2xl z-50 transition-transform duration-300 overflow-y-auto border-l",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
        <h2 className="font-inter font-semibold text-lg text-gray-900">Event Details</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="font-inter text-gray-500 text-sm mb-4">Error loading event details</p>
            <Button variant="outline" onClick={onClose} className="font-inter">
              Close
            </Button>
          </div>
        ) : event ? (
          <>
            {/* Event Image */}
            <div className="relative">
              <LineupImage
                src={event.image_urls?.[0] || "/img/default.jpg"}
                alt={event.title}
                aspectRatio="video"
                overlayVariant="ocean"
                className="w-full h-48 sm:h-56 rounded-xl"
              />
              {event.event_category && (
                <div className="absolute top-3 left-3">
                  <CategoryPill 
                    category={event.event_category} 
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-inter font-bold text-xl sm:text-2xl text-gray-900 mb-4 leading-tight">{event.title}</h1>
                
                {/* Key Details */}
                <div className="space-y-3">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="font-inter">
                      {event.start_date ? formatDate(event.start_date) : 'Date TBA'}
                      {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="font-inter">{event.venues?.name || event.location || 'Location TBA'}</span>
                  </div>
                </div>
              </div>

              {/* RSVP Buttons */}
              {isAuthenticated && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <EventRsvpButtons
                    currentStatus={event.rsvp_status || null}
                    onRsvp={handleRsvpClick}
                    isLoading={rsvpLoading}
                    size="default"
                  />
                </div>
              )}

              {/* Description */}
              {event.description && (
                <div>
                  <h3 className="font-inter font-semibold text-gray-900 mb-3">About</h3>
                  <p className="font-inter text-sm text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}

              {/* Location Details */}
              {event.venues && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="font-inter font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </h3>
                    <div className="space-y-2">
                      <p className="font-inter font-medium text-gray-900">{event.venues.name}</p>
                      {(event.venues.street || event.venues.city || event.venues.postal_code) && (
                        <p className="font-inter text-sm text-gray-600">
                          {[event.venues.street, event.venues.city, event.venues.postal_code]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      {(event.venues.website || event.venues.google_maps) && (
                        <div className="flex gap-4 mt-3">
                          {event.venues.website && (
                            <a
                              href={event.venues.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-inter text-sm text-primary hover:text-primary/80 hover:underline"
                            >
                              Website
                            </a>
                          )}
                          {event.venues.google_maps && (
                            <a
                              href={event.venues.google_maps}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-inter text-sm text-primary hover:text-primary/80 hover:underline"
                            >
                              Maps
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booking Information */}
              {(event.fee || event.booking_link || event.organizer_link || event.extra_info) && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="font-inter font-semibold text-gray-900 mb-3">Booking Info</h3>
                    
                    <div className="space-y-4">
                      {typeof event.fee === 'number' && event.fee > 0 && (
                        <div className="flex items-start gap-3">
                          <Ticket className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-inter text-sm font-medium text-gray-900">Entry fee</p>
                            <p className="font-inter text-sm text-gray-600">€{event.fee.toFixed(2)}</p>
                          </div>
                        </div>
                      )}
                      
                      {event.booking_link && (
                        <div className="flex items-start gap-3">
                          <CalendarClock className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-inter text-sm font-medium text-gray-900">Booking required</p>
                            <a 
                              href={event.booking_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-inter text-sm text-primary hover:text-primary/80 hover:underline mt-1 inline-block"
                            >
                              Book Now
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {event.organizer_link && (
                        <div className="flex items-start gap-3">
                          <Globe className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-inter text-sm font-medium text-gray-900">Organizer website</p>
                            <a 
                              href={event.organizer_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-inter text-sm text-primary hover:text-primary/80 hover:underline mt-1 inline-block"
                            >
                              {new URL(event.organizer_link).hostname.replace('www.', '')}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {event.extra_info && (
                        <>
                          {(event.fee || event.booking_link || event.organizer_link) && (
                            <Separator className="my-3" />
                          )}
                          <div>
                            <p className="font-inter text-sm font-medium text-gray-900 mb-2">Additional information</p>
                            <p className="font-inter text-sm text-gray-600 leading-relaxed">{event.extra_info}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
