
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock, Users, ExternalLink, Info } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE } from '@/utils/dateUtils';

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
  const formatDateTime = (dateStr?: string | null, timeStr?: string | null) => {
    if (!dateStr || !timeStr) return null;
    try {
      const dateTime = new Date(`${dateStr}T${timeStr}`);
      return formatInTimeZone(dateTime, AMSTERDAM_TIMEZONE, 'PPP p');
    } catch (error) {
      return null;
    }
  };

  const startDateTime = formatDateTime(event.start_date, event.start_time);
  const endDateTime = formatDateTime(event.start_date, event.end_time);

  return (
    <div className="space-y-6">
      {/* Date & Time */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="event-detail-info-title flex items-center gap-2">
            <Calendar className="h-4 w-4 text-ocean-teal" />
            Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="event-detail-info-content space-y-1">
            {startDateTime && (
              <div className="flex items-start gap-2">
                <Clock className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{startDateTime}</p>
                  {endDateTime && endDateTime !== startDateTime && (
                    <p className="text-gray-500">Until {endDateTime}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      {(event.venues || event.location) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="event-detail-info-title flex items-center gap-2">
              <MapPin className="h-4 w-4 text-ocean-teal" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="event-detail-info-content">
              {event.venues ? (
                <div>
                  <p className="font-medium">{event.venues.name}</p>
                  <p className="text-gray-600">
                    {event.venues.street && `${event.venues.street}, `}
                    {event.venues.city}
                    {event.venues.postal_code && ` ${event.venues.postal_code}`}
                  </p>
                </div>
              ) : (
                <p>{event.location}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendees */}
      {isAuthenticated && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="event-detail-info-title flex items-center gap-2">
              <Users className="h-4 w-4 text-ocean-teal" />
              Who's Coming
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="event-detail-info-content space-y-2">
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

      {/* Booking Information */}
      {(event.booking_url || event.booking_info) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="event-detail-info-title flex items-center gap-2">
              <Info className="h-4 w-4 text-ocean-teal" />
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="event-detail-info-content space-y-3">
              {event.booking_info && (
                <p>{event.booking_info}</p>
              )}
              {event.booking_url && (
                <a
                  href={event.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ocean-teal hover:text-ocean-teal/80 transition-colors"
                >
                  Book tickets
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
