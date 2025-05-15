
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { EventFriendRsvps } from '@/components/events/EventFriendRsvps';
import { EventLocationInfo } from '@/components/events/EventLocationInfo';
import { BookingInformation } from '@/components/events/BookingInformation';
import { EventAttendeesList } from '@/components/events/EventAttendeesList';

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
      {/* Location Section */}
      <Card className="shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '150ms' }}>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-3">Location</h3>
          <EventLocationInfo venue={event.venues} />
        </CardContent>
      </Card>

      {/* Booking Info Section */}
      <Card className="shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '225ms' }}>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-3">Booking Info</h3>
          <BookingInformation event={event} compact={true} />
        </CardContent>
      </Card>

      {/* Friends Attending Section */}
      {isAuthenticated && (
        <Card className="shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold mb-3">Friends Attending</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Going: {attendees?.going?.length || 0}</span>
              <span className="text-sm font-medium">Interested: {attendees?.interested?.length || 0}</span>
            </div>
            <EventAttendeesList 
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
