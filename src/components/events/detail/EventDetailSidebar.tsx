
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, ExternalLink, Info, Ticket, Globe, CalendarClock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EventDetailSidebarProps {
  event: Event;
  attendees: { going: any[]; interested: any[] };
  isAuthenticated: boolean;
}

export const EventDetailSidebar: React.FC<EventDetailSidebarProps> = ({
  event,
  attendees,
  isAuthenticated
}) => {
  const hasFee = typeof event.fee === 'number' && event.fee > 0;
  const hasBookingLink = !!event.booking_link;
  const hasOrganizerLink = !!event.organizer_link;
  const hasExtraInfo = !!event.extra_info;
  
  // Check if we have any booking info to display
  const showBookingInfo = hasFee || hasBookingLink || hasOrganizerLink || hasExtraInfo;

  return (
    <div className="space-y-6">
      {/* Location */}
      {(event.venues || event.location) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-graphite-grey">
              <MapPin className="h-4 w-4 text-ocean-teal" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm">
              {event.venues ? (
                <div>
                  <p className="font-medium">{event.venues.name}</p>
                  <p className="text-gray-600">
                    {event.venues.street && `${event.venues.street}, `}
                    {event.venues.city}
                    {event.venues.postal_code && ` ${event.venues.postal_code}`}
                  </p>
                  {event.venues.google_maps && (
                    <a
                      href={event.venues.google_maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ocean-teal hover:text-ocean-teal/80 transition-colors mt-2"
                    >
                      View on map
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ) : (
                <p>{event.location}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Information */}
      {showBookingInfo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-graphite-grey">
              <Info className="h-4 w-4 text-ocean-teal" />
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm space-y-3">
              {hasFee && (
                <div className="flex items-start gap-2">
                  <Ticket className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Entry fee</p>
                    <p className="text-gray-600">€{event.fee}</p>
                  </div>
                </div>
              )}

              {hasBookingLink && (
                <div className="flex items-start gap-2">
                  <CalendarClock className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Booking required</p>
                    <a
                      href={event.booking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ocean-teal hover:text-ocean-teal/80 transition-colors"
                    >
                      Book tickets
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              {hasOrganizerLink && (
                <div className="flex items-start gap-2">
                  <Globe className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Organizer website</p>
                    <a
                      href={event.organizer_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ocean-teal hover:text-ocean-teal/80 transition-colors"
                    >
                      {new URL(event.organizer_link).hostname.replace('www.', '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              {hasExtraInfo && (
                <>
                  {(hasFee || hasBookingLink || hasOrganizerLink) && <Separator className="my-2" />}
                  <div>
                    <p className="text-gray-600">{event.extra_info}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendees */}
      {isAuthenticated && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-graphite-grey">
              <Users className="h-4 w-4 text-ocean-teal" />
              Who's Coming
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Going</span>
                <span className="font-medium">{attendees.going.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Interested</span>
                <span className="font-medium">{attendees.interested.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
