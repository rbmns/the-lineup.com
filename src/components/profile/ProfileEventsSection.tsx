
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserEvents } from '@/components/profile/UserEvents';
import { UserPastEvents } from '@/components/profile/UserPastEvents';
import { Event, UserProfile } from '@/types';
import { Button } from '@/components/ui/button';

interface ProfileEventsSectionProps {
  canViewEvents: boolean;
  upcomingEvents: Event[];
  pastEvents: Event[];
  eventsLoading: boolean;
  isCurrentUser: boolean;
  username?: string;
  handleAddFriend: () => void;
  friendshipStatus: 'none' | 'pending' | 'accepted';
}

export const ProfileEventsSection: React.FC<ProfileEventsSectionProps> = ({
  canViewEvents,
  upcomingEvents,
  pastEvents,
  eventsLoading,
  isCurrentUser,
  username = '',
  handleAddFriend,
  friendshipStatus
}) => {
  if (!canViewEvents) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg mt-6">
        <p className="text-gray-600 text-sm">
          Connect with {username || 'this user'} to see their events
        </p>
        {friendshipStatus === 'none' && (
          <Button onClick={handleAddFriend} className="mt-3" size="sm">
            Add Friend
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="pt-1">
          <UserEvents 
            events={upcomingEvents}
            loading={eventsLoading}
            isCurrentUser={isCurrentUser}
            username={username}
            showRsvpStatus={true}
          />
        </TabsContent>
        
        <TabsContent value="past" className="pt-1">
          <UserPastEvents 
            events={pastEvents}
            loading={eventsLoading}
            isCurrentUser={isCurrentUser}
            username={username}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
