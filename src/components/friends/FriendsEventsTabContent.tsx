
import React, { useState, useMemo } from 'react';
import { Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFriendsEvents } from '@/hooks/useFriendsEvents';
import { FriendEventCard } from './FriendEventCard';

interface FriendsEventsTabContentProps {
  friendIds: string[];
  currentUserId?: string;
  friends: any[];
}

export const FriendsEventsTabContent: React.FC<FriendsEventsTabContentProps> = ({ 
  friendIds, 
  currentUserId,
  friends 
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [typeFilter, setTypeFilter] = useState<'all' | 'events' | 'casual-plans'>('all');

  const { friendsEvents, isLoading } = useFriendsEvents(friendIds, currentUserId);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = friendsEvents.filter(event => {
      const eventDate = new Date(event.start_date || '');
      return eventDate >= now;
    });
    const past = friendsEvents.filter(event => {
      const eventDate = new Date(event.start_date || '');
      return eventDate < now;
    });
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [friendsEvents]);

  const getFriendProfile = (friendUserId: string) => {
    return friends.find(friend => friend.id === friendUserId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-4 p-4 border rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Friends' Events</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upcoming' | 'past')} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              Upcoming
              {upcomingEvents.length > 0 && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  {upcomingEvents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              Past
              {pastEvents.length > 0 && (
                <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                  {pastEvents.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-3">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('all')}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              variant={typeFilter === 'events' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('events')}
              className="rounded-full"
            >
              Events
            </Button>
          </div>
        </div>

        <TabsContent value="upcoming">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <FriendEventCard 
                  key={event.id} 
                  event={event}
                  friendProfile={getFriendProfile(event.friend_user_id || event.creator?.id || '')}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
              <p className="text-gray-600">
                Events from your friends will appear here when they create them or RSVP to events.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastEvents.length > 0 ? (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <FriendEventCard 
                  key={event.id} 
                  event={event}
                  friendProfile={getFriendProfile(event.friend_user_id || event.creator?.id || '')}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
              <p className="text-gray-600">
                Past events from your friends will appear here.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
