
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, ExternalLink, Info, Ticket, Globe, CalendarClock, User } from 'lucide-react';
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
  const hasBookingInfo = hasFee || hasBookingLink;

  // Generate Google Maps URL
  const getGoogleMapsUrl = () => {
    if (event.venues?.google_maps) {
      return event.venues.google_maps;
    }
    
    // Fallback: construct Google Maps search URL
    const venue = event.venues;
    if (venue) {
      const searchQuery = [
        venue.name,
        venue.street,
        venue.city,
        venue.postal_code
      ].filter(Boolean).join(', ');
      
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
    }
    
    return null;
  };

  const googleMapsUrl = getGoogleMapsUrl();

  return (
    <div className="space-y-6">
      {/* Location Card */}
      <Card className="bg-pure-white border border-mist-grey">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-graphite-grey flex items-center">
            <MapPin className="h-5 w-5 text-ocean-teal mr-2" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {event.venues ? (
            <>
              {event.venues.name && (
                <div>
                  <h4 className="font-semibold text-graphite-grey">{event.venues.name}</h4>
                </div>
              )}
              
              <div className="text-sm text-graphite-grey/80">
                {[
                  event.venues.street,
                  event.venues.postal_code,
                  event.venues.city
                ].filter(Boolean).join(', ')}
              </div>
              
              {googleMapsUrl && (
                <a 
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-ocean-teal/80 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Google Maps
                </a>
              )}
            </>
          ) : (
            <div className="text-sm text-graphite-grey/60 italic">
              Location details not available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Information Card */}
      {hasBookingInfo && (
        <Card className="bg-pure-white border border-mist-grey">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-graphite-grey flex items-center">
              <Ticket className="h-5 w-5 text-ocean-teal mr-2" />
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Entry Fee */}
            {event.fee !== null && event.fee !== undefined && (
              <div>
                <p className="text-sm font-medium text-graphite-grey mb-1">Entry fee</p>
                <p className="text-base font-semibold text-graphite-grey">
                  {event.fee === 0 ? 'Free Event' : `€${event.fee}`}
                </p>
              </div>
            )}
            
            {/* Booking Link */}
            {hasBookingLink && (
              <>
                {hasFee && <Separator className="my-3" />}
                <div>
                  <p className="text-sm font-medium text-graphite-grey mb-2">Tickets</p>
                  <a 
                    href={event.booking_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-ocean-teal text-pure-white px-4 py-2 rounded-md hover:bg-ocean-teal/90 transition-colors font-medium text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Book Tickets
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Organizer Information Card */}
      <Card className="bg-pure-white border border-mist-grey">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-graphite-grey flex items-center">
            <User className="h-5 w-5 text-ocean-teal mr-2" />
            Organizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-ocean-teal to-sage rounded-full flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-pure-white font-montserrat">
                {event.organiser_name ? event.organiser_name.charAt(0).toUpperCase() : 
                 event.creator?.username ? event.creator.username.charAt(0).toUpperCase() : 'O'}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-graphite-grey">
                {event.organiser_name || event.creator?.username || 'Event Organizer'}
              </h4>
              {event.creator?.email && (
                <p className="text-sm text-graphite-grey/70">{event.creator.email}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendees Card - only show if authenticated */}
      {isAuthenticated && (
        <Card className="bg-pure-white border border-mist-grey">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-graphite-grey flex items-center">
              <Users className="h-5 w-5 text-ocean-teal mr-2" />
              Attendees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-sage rounded-full"></div>
                <span className="font-medium text-graphite-grey">
                  {attendees.going.length} going
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-clay rounded-full"></div>
                <span className="font-medium text-graphite-grey">
                  {attendees.interested.length} interested
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
