
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, ExternalLink, Info, Ticket, Globe, CalendarClock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EventDetailSidebarProps {
  event: Event;
  attendees: {
    going: any[];
    interested: any[];
  };
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
      {/* Event Details Card */}
      <Card className="bg-pure-white border border-mist-grey">
        <CardHeader>
          <CardTitle className="text-h4 text-graphite-grey font-montserrat">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-ocean-teal mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-body-base font-semibold text-graphite-grey mb-1">Location</h4>
              <p className="text-body-small text-graphite-grey/80">
                {event.venues?.name || event.location || 'Location TBD'}
              </p>
            </div>
          </div>

          {/* Attendees */}
          {isAuthenticated && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-ocean-teal mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-body-base font-semibold text-graphite-grey mb-1">Attendees</h4>
                <p className="text-body-small text-graphite-grey/80">
                  {attendees.going.length} going, {attendees.interested.length} interested
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
