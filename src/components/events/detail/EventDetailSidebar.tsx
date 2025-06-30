
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
    <div className="space-y-4">
      {/* Location */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900 mb-1 text-left">Location</h3>
              <p className="text-sm text-gray-600 text-left">{eventLocation}</p>
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View on map
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Info */}
      {(event.fee || event.booking_link) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Ticket className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 mb-3 text-left">Booking Info</h3>
                
                {event.fee && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Entry fee: </span>
                    <span className="font-medium">€{event.fee}</span>
                  </div>
                )}
                
                {event.booking_link && (
                  <div>
                    <a
                      href={event.booking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Booking
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendee Summary */}
      {isAuthenticated && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="w-full text-left">
                <h3 className="font-medium text-gray-900 mb-3 text-left">Attendees</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Going</span>
                    <span className="text-sm font-medium">{attendees?.going?.length || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Interested</span>
                    <span className="text-sm font-medium">{attendees?.interested?.length || 0}</span>
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
