
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventsList } from '@/components/events/list-components/EventsList';
import { Skeleton } from '@/components/ui/skeleton';

interface EventsSidebarProps {
  popularEvents: Event[];
  featuredEvents: Event[];
  isLoading?: boolean;
}

export const EventsSidebar: React.FC<EventsSidebarProps> = ({
  popularEvents,
  featuredEvents,
  isLoading = false
}) => {
  return (
    <div className="space-y-6">
      {/* Featured Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Featured Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[120px] w-full rounded-md" />
              <Skeleton className="h-[120px] w-full rounded-md" />
            </div>
          ) : featuredEvents.length > 0 ? (
            <EventsList 
              events={featuredEvents.slice(0, 2)} 
              compact
              showRsvpButtons={false}
            />
          ) : (
            <p className="text-sm text-gray-500 py-2">No featured events</p>
          )}
        </CardContent>
      </Card>
      
      {/* Popular Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Popular Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[120px] w-full rounded-md" />
              <Skeleton className="h-[120px] w-full rounded-md" />
            </div>
          ) : popularEvents.length > 0 ? (
            <EventsList 
              events={popularEvents.slice(0, 2)} 
              compact
              showRsvpButtons={false}
            />
          ) : (
            <p className="text-sm text-gray-500 py-2">No popular events</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsSidebar;
