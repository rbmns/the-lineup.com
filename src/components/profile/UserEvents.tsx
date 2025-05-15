
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import EventCardList from '@/components/events/EventCardList';

interface UserEventsProps {
  events: Event[];
  loading: boolean;
  isCurrentUser?: boolean;
  username?: string;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpStatus?: boolean;
}

export const UserEvents = ({ 
  events, 
  loading, 
  isCurrentUser, 
  username = 'User',
  onRsvp,
  showRsvpStatus = false
}: UserEventsProps) => {
  return (
    <div className="mt-4 sm:mt-6">
      <h2 className="text-lg font-semibold mb-2 sm:mb-3 flex items-center">
        <Calendar className="mr-2 h-4 w-4 text-purple" />
        {isCurrentUser ? "Your Upcoming Events" : `${username}'s Upcoming Events`}
      </h2>
      
      {loading ? (
        <div className="space-y-2 sm:space-y-3">
          <div className="h-16 sm:h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-16 sm:h-20 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-2.5">
          {events.length > 0 ? (
            events.map(event => (
              <EventCardList
                key={event.id}
                event={event}
                showRsvpStatus={showRsvpStatus}
                onRsvp={onRsvp}
              />
            ))
          ) : (
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-3 sm:p-4 text-center text-gray-500">
                <p className="text-sm">No upcoming events</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
