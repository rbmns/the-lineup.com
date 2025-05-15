
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';
import EventCardList from '@/components/events/EventCardList';

interface UserPastEventsProps {
  events: Event[];
  loading: boolean;
  isCurrentUser?: boolean;
  username?: string;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
}

export const UserPastEvents: React.FC<UserPastEventsProps> = ({ 
  events, 
  loading, 
  isCurrentUser, 
  username = 'User',
  onRsvp 
}) => {
  if (loading) {
    return (
      <div className="mt-4 sm:mt-6">
        <h2 className="text-lg font-semibold mb-2 sm:mb-3 flex items-center">
          <History className="mr-2 h-4 w-4 text-gray-500" />
          {isCurrentUser ? "Your Past Events" : `${username}'s Past Events`}
        </h2>
        <div className="space-y-2 sm:space-y-3">
          <div className="h-16 sm:h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-16 sm:h-20 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="mt-4 sm:mt-6">
        <h2 className="text-lg font-semibold mb-2 sm:mb-3 flex items-center">
          <History className="mr-2 h-4 w-4 text-gray-500" />
          {isCurrentUser ? "Your Past Events" : `${username}'s Past Events`}
        </h2>
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-3 sm:p-4 text-center text-gray-500">
            <p className="text-sm">No past events</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6">
      <h2 className="text-lg font-semibold mb-2 sm:mb-3 flex items-center">
        <History className="mr-2 h-4 w-4 text-gray-500" />
        {isCurrentUser ? "Your Past Events" : `${username}'s Past Events`}
      </h2>
      
      <div className="space-y-2 sm:space-y-2.5">
        {events.map(event => (
          <EventCardList
            key={event.id}
            event={event}
            showRsvpStatus={false}
          />
        ))}
      </div>
    </div>
  );
};
