
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, ExternalLink, Ticket } from 'lucide-react';

interface EventDetailSidebarProps {
  event: Event;
  attendees?: { going: any[]; interested: any[] };
  isAuthenticated: boolean;
}

export const EventDetailSidebar: React.FC<EventDetailSidebarProps> = ({
  event,
  attendees,
  isAuthenticated
}) => {
  const eventLocation = event.venues?.name 
    ? `${event.venues.name}${event.venues.city ? `, ${event.venues.city}` : ''}` 
    : event.location || 'Location TBD';

  const getGoogleMapsUrl = () => {
    if (event.venues?.google_maps) {
      return event.venues.google_maps;
    }

    if (event.venues) {
      const searchQuery = [
        event.venues.name,
        event.venues.street,
        event.venues.city,
        event.venues.postal_code
      ].filter(Boolean).join(', ');
      
      if (searchQuery) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
      }
    }

    if (event.location) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
    }
    
    return null;
  };

  const googleMapsUrl = getGoogleMapsUrl();

  return (
    <div className="space-y-6">
      {/* Location Card */}
      <Card className="bg-pure-white border border-mist-grey shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-ocean-teal mt-1 flex-shrink-0" />
            <div className="text-left flex-1">
              <h3 className="text-h4 text-graphite-grey font-montserrat mb-2">Location</h3>
              <p className="text-body-base text-graphite-grey font-lato mb-3">{eventLocation}</p>
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-small text-ocean-teal hover:text-graphite-grey hover:underline font-lato"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on map
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Info Card */}
      {(event.fee || event.booking_link) && (
        <Card className="bg-pure-white border border-mist-grey shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Ticket className="h-5 w-5 text-ocean-teal mt-1 flex-shrink-0" />
              <div className="text-left flex-1">
                <h3 className="text-h4 text-graphite-grey font-montserrat mb-3">Booking Info</h3>
                
                {event.fee && (
                  <div className="mb-3">
                    <span className="text-body-base text-graphite-grey font-lato">Entry fee: </span>
                    <span className="text-body-base font-montserrat font-semibold text-graphite-grey">€{event.fee}</span>
                  </div>
                )}
                
                {event.booking_link && (
                  <div>
                    <a
                      href={event.booking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-small text-ocean-teal hover:text-graphite-grey hover:underline font-lato"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Book tickets
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendee Summary Card */}
      {isAuthenticated && (
        <Card className="bg-pure-white border border-mist-grey shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-ocean-teal mt-1 flex-shrink-0" />
              <div className="w-full text-left">
                <h3 className="text-h4 text-graphite-grey font-montserrat mb-4">Attendees</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-body-base text-graphite-grey font-lato">Going</span>
                    <span className="text-body-base font-montserrat font-semibold text-graphite-grey">
                      {attendees?.going?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-body-base text-graphite-grey font-lato">Interested</span>
                    <span className="text-body-base font-montserrat font-semibold text-graphite-grey">
                      {attendees?.interested?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
