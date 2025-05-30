
import React, { useState } from 'react';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data for demo purposes
const mockEvents = [
  {
    id: "1",
    title: "Beach Cleanup Day",
    date: "Sat, 15 June",
    time: "10:00-13:00",
    location: "Main Beach",
    host: "Chrissi",
    attendees: 12,
    additionalAttendees: 9,
    image: "/lovable-uploads/2de9324a-d7ca-416a-b1fe-0059406dd47f.png",
    type: "upcoming"
  }
];

export const FriendsEventsTabContent: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [typeFilter, setTypeFilter] = useState<'all' | 'events' | 'casual-plans'>('all');

  const upcomingCount = mockEvents.filter(e => e.type === 'upcoming').length;
  const pastCount = mockEvents.filter(e => e.type === 'past').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Friends' Events Tab</h2>
      </div>
      
      {/* Time Filter Pills */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={timeFilter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setTimeFilter('upcoming')}
          className="rounded-full"
        >
          Upcoming {upcomingCount > 0 && <Badge variant="secondary" className="ml-2">{upcomingCount}</Badge>}
        </Button>
        <Button
          variant={timeFilter === 'past' ? 'default' : 'outline'}
          onClick={() => setTimeFilter('past')}
          className="rounded-full"
        >
          Past {pastCount > 0 && <Badge variant="secondary" className="ml-2">{pastCount}</Badge>}
        </Button>
      </div>

      {/* Type Filter Pills */}
      <div className="flex gap-3 mb-6">
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
        <Button
          variant={typeFilter === 'casual-plans' ? 'default' : 'outline'}
          onClick={() => setTypeFilter('casual-plans')}
          className="rounded-full"
        >
          Casual Plans
        </Button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {mockEvents.map((event) => (
          <Card key={event.id} className="p-0 overflow-hidden">
            <div className="flex">
              {/* Event Image */}
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Event Details */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Event</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees}</span>
                      <span className="text-gray-400">+{event.additionalAttendees}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Hosted by: <span className="font-medium">{event.host}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {mockEvents.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600">
              Events from your friends will appear here when they create them.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
