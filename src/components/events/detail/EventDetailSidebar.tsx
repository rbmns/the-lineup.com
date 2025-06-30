
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, ExternalLink, Info, Ticket, Globe, CalendarClock, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { filterFriendsFromAttendees } from '@/services/friendsService';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [friendAttendees, setFriendAttendees] = useState<{
    going: any[];
    interested: any[];
  }>({
    going: [],
    interested: []
  });

  // Filter attendees to only show friends
  useEffect(() => {
    const filterAttendees = async () => {
      if (!attendees || !user?.id || !isAuthenticated) {
        setFriendAttendees({
          going: [],
          interested: []
        });
        return;
      }
      try {
        const [friendsGoing, friendsInterested] = await Promise.all([
          filterFriendsFromAttendees(attendees.going || [], user.id),
          filterFriendsFromAttendees(attendees.interested || [], user.id)
        ]);
        setFriendAttendees({
          going: friendsGoing,
          interested: friendsInterested
        });
      } catch (error) {
        console.error('Error filtering friend attendees:', error);
        setFriendAttendees({
          going: [],
          interested: []
        });
      }
    };
    filterAttendees();
  }, [attendees, user?.id, isAuthenticated]);

  const handleUserClick = (userId: string) => {
    console.log('Navigating to user profile:', userId);
    navigate(`/user/${userId}`);
  };

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
      <Card className="bg-pure-white border border-mist-grey shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-graphite-grey flex items-center">
            <MapPin className="h-5 w-5 text-ocean-teal mr-3" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.venues ? (
            <>
              {event.venues.name && (
                <div>
                  <h4 className="font-semibold text-graphite-grey text-base">{event.venues.name}</h4>
                </div>
              )}
              
              <div className="text-sm text-graphite-grey/70">
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
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-ocean-teal/80 transition-colors text-sm font-medium mt-3"
                >
                  View on map
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
        <Card className="bg-pure-white border border-mist-grey shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-graphite-grey">
              Booking Info
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

      {/* Friends Attending - only show if authenticated and there are friend attendees */}
      {isAuthenticated && (friendAttendees.going.length > 0 || friendAttendees.interested.length > 0) && (
        <Card className="bg-pure-white border border-mist-grey shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-graphite-grey">
              Friends Attending
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {friendAttendees.going.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-graphite-grey mb-3 flex items-center">
                  Going
                  <span className="ml-2 text-sm text-graphite-grey/70">
                    {friendAttendees.going.length}
                  </span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {friendAttendees.going.slice(0, 3).map(attendee => (
                    <button 
                      key={attendee.id} 
                      onClick={() => handleUserClick(attendee.id)} 
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-ocean-teal to-sage rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-pure-white">
                          {attendee.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-graphite-grey">{attendee.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {friendAttendees.interested.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-graphite-grey mb-3 flex items-center">
                  Interested
                  <span className="ml-2 text-sm text-graphite-grey/70">
                    {friendAttendees.interested.length}
                  </span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {friendAttendees.interested.slice(0, 3).map(attendee => (
                    <button 
                      key={attendee.id} 
                      onClick={() => handleUserClick(attendee.id)} 
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-clay to-seafoam rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-pure-white">
                          {attendee.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-graphite-grey">{attendee.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Attendees Summary */}
            <div className="pt-4 border-t border-mist-grey">
              <h4 className="text-base font-medium text-graphite-grey mb-2">All Attendees</h4>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-graphite-grey/80">
                  Going: <span className="font-medium text-graphite-grey">{attendees.going.length}</span>
                </span>
                <span className="text-graphite-grey/80">
                  Interested: <span className="font-medium text-graphite-grey">{attendees.interested.length}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendees Card - only show if authenticated and no friends attending */}
      {isAuthenticated && friendAttendees.going.length === 0 && friendAttendees.interested.length === 0 && (
        <Card className="bg-pure-white border border-mist-grey shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-graphite-grey flex items-center">
              <Users className="h-5 w-5 text-ocean-teal mr-3" />
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
