
import React from 'react';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useAuth } from '@/contexts/AuthContext';
import { X, Calendar, MapPin, Users, Ticket, Globe, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryPill } from '@/components/ui/category-pill';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { LineupImage } from '@/components/ui/lineup-image';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
  const { data: event, isLoading, error } = useEventDetails(eventId);
  const { handleRsvp, loading: rsvpLoading } = useRsvpActions(user?.id);

  const handleRsvpClick = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!event) return false;
    try {
      const result = await handleRsvp(event.id, status);
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
    <>
      {/* Backdrop for mobile */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Side panel - positioned as a middle column */}
      <div
        className={cn(
          "fixed right-0 top-16 bottom-0 w-full max-w-md bg-white shadow-xl z-50 transition-transform duration-300 overflow-y-auto",
          "lg:relative lg:top-0 lg:shadow-lg lg:border-l lg:border-r",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between z-10">
          <h2 className="font-semibold text-lg">Event Details</h2>
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
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Error loading event details</p>
              <Button variant="outline" onClick={onClose} className="mt-4">
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
                  className="w-full h-48"
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
              <div className="space-y-3">
                <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
                
                {/* Date & Time */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {event.start_date ? formatDate(event.start_date) : 'Date TBA'}
                    {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{event.venues?.name || event.location || 'Location TBA'}</span>
                </div>

                {/* RSVP Buttons */}
                {isAuthenticated && (
                  <div className="pt-2">
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
                  <div className="pt-2">
                    <h3 className="font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Location Details */}
                {event.venues && (
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </h3>
                      <div className="space-y-2">
                        <p className="font-medium">{event.venues.name}</p>
                        {(event.venues.street || event.venues.city || event.venues.postal_code) && (
                          <p className="text-sm text-gray-600">
                            {[event.venues.street, event.venues.city, event.venues.postal_code]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        )}
                        {(event.venues.website || event.venues.google_maps) && (
                          <div className="flex gap-4 mt-2">
                            {event.venues.website && (
                              <a
                                href={event.venues.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Website
                              </a>
                            )}
                            {event.venues.google_maps && (
                              <a
                                href={event.venues.google_maps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
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
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Booking Info</h3>
                      
                      <div className="space-y-3">
                        {typeof event.fee === 'number' && event.fee > 0 && (
                          <div className="flex items-start gap-2">
                            <Ticket className="h-4 w-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium">Entry fee</p>
                              <p className="text-sm">€{event.fee.toFixed(2)}</p>
                            </div>
                          </div>
                        )}
                        
                        {event.booking_link && (
                          <div className="flex items-start gap-2">
                            <CalendarClock className="h-4 w-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium">Booking required</p>
                              <a 
                                href={event.booking_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                              >
                                Book Now
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {event.organizer_link && (
                          <div className="flex items-start gap-2">
                            <Globe className="h-4 w-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium">Organizer website</p>
                              <a 
                                href={event.organizer_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                              >
                                {new URL(event.organizer_link).hostname.replace('www.', '')}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {event.extra_info && (
                          <>
                            {(event.fee || event.booking_link || event.organizer_link) && (
                              <Separator className="my-2" />
                            )}
                            <div>
                              <p className="text-sm font-medium mb-1">Additional information</p>
                              <p className="text-sm text-gray-600">{event.extra_info}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attendees Info */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4" />
                      <span className="font-medium text-sm">Attendees</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">Going: {event.attendees?.going || 0}</span>
                        <span className="font-medium">Interested: {event.attendees?.interested || 0}</span>
                      </div>
                      
                      {!isAuthenticated && (
                        <p className="text-xs text-gray-500 mt-2">
                          Sign up to see who's attending and connect with other attendees
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};
