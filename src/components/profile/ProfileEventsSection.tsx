
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, History, Users } from 'lucide-react';
import EventCardList from '@/components/events/EventCardList';

interface ProfileEventsSectionProps {
  canViewEvents: boolean;
  upcomingEvents: Event[];
  pastEvents: Event[];
  eventsLoading: boolean;
  isCurrentUser?: boolean;
  username?: string;
  handleAddFriend?: () => void;
  friendshipStatus?: string;
}

export const ProfileEventsSection: React.FC<ProfileEventsSectionProps> = ({
  canViewEvents,
  upcomingEvents,
  pastEvents,
  eventsLoading,
  isCurrentUser = false,
  username = 'User',
  handleAddFriend,
  friendshipStatus = 'none'
}) => {
  if (!canViewEvents) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary p-6 md:p-8">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-neutral-50 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-primary mb-3">
            {friendshipStatus === 'none' ? 'Connect to See Events' : 'Events Hidden'}
          </h3>
          <p className="text-neutral-50 mb-6 text-sm md:text-base max-w-md mx-auto">
            {friendshipStatus === 'none' 
              ? `Add ${username} as a friend to see their event activity`
              : `${username}'s events are private`
            }
          </p>
          {friendshipStatus === 'none' && handleAddFriend && (
            <button 
              onClick={handleAddFriend}
              className="bg-primary hover:bg-primary-75 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Friend
            </button>
          )}
        </div>
      </div>
    );
  }

  if (eventsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-secondary p-6 md:p-8">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center text-primary">
          <Calendar className="h-5 w-5 md:h-6 md:w-6 mr-3" />
          {isCurrentUser ? "Your Upcoming Events" : `${username}'s Upcoming Events`}
        </h2>
        
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <EventCardList
                key={event.id}
                event={event}
                showRsvpStatus={true}
              />
            ))}
          </div>
        ) : (
          <Card className="border border-gray-100">
            <CardContent className="p-6 md:p-8 text-center text-gray-500">
              <p className="text-sm md:text-base">
                {isCurrentUser ? "No upcoming events" : `${username} has no upcoming events`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Events */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center text-primary">
          <History className="h-5 w-5 md:h-6 md:w-6 mr-3" />
          {isCurrentUser ? "Your Past Events" : `${username}'s Past Events`}
        </h2>
        
        {pastEvents.length > 0 ? (
          <div className="space-y-3">
            {pastEvents.map(event => (
              <EventCardList
                key={event.id}
                event={event}
                showRsvpStatus={true}
                showRsvpButtons={false}
              />
            ))}
          </div>
        ) : (
          <Card className="border border-gray-100">
            <CardContent className="p-6 md:p-8 text-center text-gray-500">
              <p className="text-sm md:text-base">
                {isCurrentUser ? "No past events" : `${username} has no past events`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
