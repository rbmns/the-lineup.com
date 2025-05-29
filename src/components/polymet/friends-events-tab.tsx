import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/polymet/button';
import CategoryBadge from '@/components/polymet/category-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Mock data for demo purposes
const mockFriendsEventsData = {
  friendsEvents: [
    {
      id: "1",
      title: "Sunset Beach Party",
      category: "Party",
      organizer: "Alex Johnson",
      date: "Saturday",
      time: "6:00 PM",
      location: "Venice Beach",
      attendees: 12,
      maxAttendees: 20
    }
  ]
};

interface FriendsEventsTabProps {
  className?: string;
}

export default function FriendsEventsTab({ className }: FriendsEventsTabProps) {
  return (
    <Card className={cn("border-0", className)}>
      <CardContent className="p-0">
        <div className="grid gap-4">
          {mockFriendsEventsData.friendsEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 hover:bg-secondary-50"
            >
              <div className="flex items-center">
                <Avatar className="mr-3 h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" alt={event.organizer} />
                  <AvatarFallback>{event.organizer.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-medium leading-none">{event.title}</h4>
                  <p className="text-sm text-primary-75">
                    Organized by {event.organizer}
                  </p>
                </div>
              </div>
              <div className="space-x-2">
                <Badge variant="secondary">{event.date}</Badge>
                <CategoryBadge category={event.category} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
