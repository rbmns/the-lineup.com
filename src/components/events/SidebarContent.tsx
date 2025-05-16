
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { EventFriendRsvps } from '@/components/events/EventFriendRsvps';
import { EventLocationInfo } from '@/components/events/EventLocationInfo';
import { EventAttendeesList } from '@/components/events/EventAttendeesList';
import { MapPin, Ticket, Globe, CalendarClock, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SidebarContentProps {
  event: Event;
  attendees: { going: any[]; interested: any[] };
  isAuthenticated: boolean;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  event,
  attendees,
  isAuthenticated
}) => {
  const hasFee = typeof event.fee === 'number' && event.fee > 0;
  const hasBookingLink = !!event.booking_link;
  const hasExtraInfo = !!event.extra_info && event.extra_info.trim() !== '';
  const hasOrganizerLink = !!event.organizer_link;
  const navigate = useNavigate();
  
  // Check if we need to show booking info
  const showBookingInfo = hasFee || hasBookingLink || hasExtraInfo || hasOrganizerLink;

  // Handler for the sign up button
  const handleSignUpClick = () => {
    navigate('/login', { state: { initialMode: 'register' } });
  };

  return (
    <div className="space-y-4">
      {/* Location Section */}
      <Card className="shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '150ms' }}>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-3">Location</h3>
          <EventLocationInfo venue={event.venues} />
        </CardContent>
      </Card>

      {/* Booking Info Section */}
      {showBookingInfo && (
        <Card className="shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '225ms' }}>
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold mb-3">Booking Info</h3>
            
            <div className="space-y-4">
              {hasFee && (
                <div className="flex items-start gap-2">
                  <Ticket className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Entry fee</p>
                    <p className="text-sm">{typeof event.fee === 'number' ? `€${event.fee.toFixed(2)}` : 'Free'}</p>
                  </div>
                </div>
              )}
              
              {hasBookingLink && (
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
              
              {hasOrganizerLink && (
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
              
              {hasExtraInfo && (
                <>
                  {(hasFee || hasBookingLink || hasOrganizerLink) && <Separator className="my-2" />}
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

      {/* Attendees / Friends Teaser Section */}
      <Card className="shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-3">Friends Attending</h3>
          
          {isAuthenticated ? (
            /* Authenticated Users: Show attendees list */
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium">Going: {attendees?.going?.length || 0}</span>
                <span className="text-sm font-medium">Interested: {attendees?.interested?.length || 0}</span>
              </div>
              <EventAttendeesList 
                going={attendees?.going || []} 
                interested={attendees?.interested || []} 
              />
            </>
          ) : (
            /* Non-authenticated Users: Show teaser */
            <div className="flex flex-col items-center">
              <div className="text-center mb-4 py-3">
                <Lock className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Sign up to see who's attending this event</p>
                <p className="text-sm text-gray-500">Join to connect with friends and discover events together</p>
              </div>
              <div className="flex justify-center w-full">
                <Button 
                  className="bg-black hover:bg-gray-800 text-white font-medium"
                  onClick={handleSignUpClick}
                >
                  Sign up to see attendees
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarContent;
