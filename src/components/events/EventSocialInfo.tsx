
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEventAttendees } from '@/lib/eventService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar } from 'lucide-react';

interface EventSocialInfoProps {
  eventId: string;
}

export const EventSocialInfo: React.FC<EventSocialInfoProps> = ({ eventId }) => {
  const { data: attendees, isLoading } = useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: () => fetchEventAttendees(eventId),
    enabled: !!eventId,
  });

  const renderAttendeeList = (attendeeList: any[], status: 'going' | 'interested', maxShow: number) => {
    if (!attendeeList || attendeeList.length === 0) return null;

    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge 
            variant="outline" 
            className={`text-xs ${
              status === 'going' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {status === 'going' ? 'Going' : 'Interested'} ({attendeeList.length})
          </Badge>
        </div>
        <div className="space-y-2">
          {attendeeList.slice(0, maxShow).map((attendeeData: any, index: number) => {
            const attendee = Array.isArray(attendeeData) ? attendeeData[0] : attendeeData;
            if (!attendee) return null;
            
            return (
              <div key={attendee.id || index} className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage 
                    src={attendee.avatar_url?.[0]} 
                    alt={attendee.username || 'User'} 
                  />
                  <AvatarFallback className={`text-xs text-white ${
                    status === 'going' ? 'bg-seafoam-green' : 'bg-sky-blue'
                  }`}>
                    {(attendee.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ocean-deep truncate">
                    {attendee.username || 'Anonymous'}
                  </p>
                  {attendee.tagline && (
                    <p className="text-xs text-gray-500 truncate">
                      {attendee.tagline}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          {attendeeList.length > maxShow && (
            <p className="text-xs text-gray-500 mt-1">
              +{attendeeList.length - maxShow} more {status}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-sand">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-seafoam-green" />
            Event Attendees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-sand rounded-full animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-sand rounded animate-pulse" />
                  <div className="h-2 bg-sand rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!attendees || (attendees.going.length === 0 && attendees.interested.length === 0)) {
    return (
      <Card className="border-sand">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-seafoam-green" />
            Event Attendees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Users className="h-6 w-6 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No attendees yet</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to RSVP!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-sand">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-seafoam-green" />
          Event Attendees
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {renderAttendeeList(attendees.going, 'going', 3)}
          {renderAttendeeList(attendees.interested, 'interested', 2)}
        </div>
      </CardContent>
    </Card>
  );
};
