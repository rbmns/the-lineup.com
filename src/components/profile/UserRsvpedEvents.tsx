
import React, { useCallback } from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navigateToEvent } from '@/utils/navigationUtils';
import EventCardList from '@/components/events/EventCardList';

interface UserRsvpedEventsProps {
  events: Event[];
  loading?: boolean;
  isCurrentUser?: boolean;
  username?: string;
  showFriendRsvp?: boolean;
  friendUsername?: string;
  isLoading?: boolean;
  userId?: string;
  currentUserId?: string;
  matchingRsvps?: Event[];
}

export const UserRsvpedEvents: React.FC<UserRsvpedEventsProps> = ({ 
  events, 
  loading, 
  isCurrentUser, 
  username = 'User',
  showFriendRsvp = false,
  friendUsername,
  isLoading = false,
  userId,
  currentUserId,
  matchingRsvps = []
}) => {
  const navigate = useNavigate();
  
  // Filter out matching RSVPs to avoid duplicate display
  const regularEvents = matchingRsvps.length > 0 
    ? events.filter(event => !matchingRsvps.some(matchEvent => matchEvent.id === event.id))
    : events;

  // Direct event navigation using utility
  const handleEventClick = useCallback((eventId: string) => {
    navigateToEvent(eventId, navigate);
  }, [navigate]);

  if (isLoading || loading) {
    return (
      <div className="mt-4 sm:mt-6">
        <h2 className="text-lg font-semibold mb-2 sm:mb-3 flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-purple" />
          {isCurrentUser ? "Your RSVPs" : `${username}'s RSVPs`}
        </h2>
        <div className="space-y-2 sm:space-y-3">
          <div className="h-16 sm:h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-16 sm:h-20 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6">
      <h2 className="text-lg font-semibold mb-2 sm:mb-3 flex items-center">
        <Calendar className="mr-2 h-4 w-4 text-purple" />
        {isCurrentUser ? "Your RSVPs" : `${username}'s RSVPs`}
      </h2>
      
      {/* Display matching RSVPs first if available */}
      {matchingRsvps.length > 0 && !isCurrentUser && (
        <div className="mb-3 sm:mb-4">
          <h3 className="text-sm font-medium mb-2 text-purple-600 px-1">Events you're both attending:</h3>
          <div className="space-y-2 sm:space-y-2.5">
            {matchingRsvps.map(event => (
              <div key={event.id} className="relative">
                <EventCardList
                  event={event}
                  showRsvpStatus={true}
                />
                <div className="mt-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs mx-1">
                  You and {friendUsername} are both {event.rsvp_status?.toLowerCase() || 'going'} to this event
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {regularEvents.length > 0 ? (
        <div className="space-y-2 sm:space-y-2.5">
          {regularEvents.map(event => (
            <EventCardList
              key={event.id}
              event={event}
              showRsvpStatus={isCurrentUser}
            />
          ))}
        </div>
      ) : (
        !matchingRsvps.length && (
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-3 sm:p-4 text-center text-gray-500">
              <p className="text-sm">No RSVPs yet</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default UserRsvpedEvents;
