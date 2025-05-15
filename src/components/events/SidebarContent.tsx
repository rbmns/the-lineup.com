
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { EventFriendRsvps } from '@/components/events/EventFriendRsvps';

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
  return (
    <div className="space-y-4">
      {/* Friends section in Card style */}
      {isAuthenticated && attendees && (attendees.going.length > 0 || attendees.interested.length > 0) && (
        <Card className="shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '225ms' }}>
          <CardContent className="p-5">
            <EventFriendRsvps
              going={attendees?.going || []}
              interested={attendees?.interested || []}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SidebarContent;
