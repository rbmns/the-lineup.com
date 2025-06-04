
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event, UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { ProfileEventCard } from './ProfileEventCard';
import { Calendar, History } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">My Events</h2>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="w-full rounded-none bg-transparent h-auto p-0 grid grid-cols-2">
            <TabsTrigger 
              value="upcoming" 
              className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <History className="h-4 w-4 mr-2" />
              Past
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="upcoming" className="p-0">
          <div className="p-6">
            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <ProfileEventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming events</p>
                <p className="text-sm text-gray-500 mt-1">
                  {isCurrentUser ? "You haven't joined any upcoming events yet" : `${username} hasn't joined any upcoming events yet`}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="p-0">
          <div className="p-6">
            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map(event => (
                  <ProfileEventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No past events</p>
                <p className="text-sm text-gray-500 mt-1">
                  {isCurrentUser ? "You haven't attended any events yet" : `${username} hasn't attended any events yet`}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
