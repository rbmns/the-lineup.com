
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users } from 'lucide-react';

interface FriendEvent {
  id: string;
  title: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  venue?: string;
  creator?: {
    id: string;
    username: string | null;
    avatar_url: string[] | null;
  };
  attendee_count?: number;
  image_urls?: string[];
}

interface FriendEventCardProps {
  event: FriendEvent;
  friendProfile?: any;
}

export const FriendEventCard: React.FC<FriendEventCardProps> = ({ event, friendProfile }) => {
  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = (avatarUrl: string[] | null) => {
    if (avatarUrl && Array.isArray(avatarUrl) && avatarUrl.length > 0) {
      return avatarUrl[0];
    }
    return null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTimeRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const startTime = start.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
    
    if (endDate) {
      const end = new Date(endDate);
      const endTime = end.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      });
      return `${startTime}-${endTime}`;
    }
    
    return startTime;
  };

  const eventImage = event.image_urls && event.image_urls.length > 0 ? event.image_urls[0] : null;

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex">
        {/* Event Image */}
        <div className="w-32 h-32 flex-shrink-0">
          {eventImage ? (
            <img 
              src={eventImage} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-yellow-600 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        
        {/* Event Details */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">Event</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(event.start_date)} • {formatTimeRange(event.start_date, event.end_date)}
              </div>
              
              {(event.location || event.venue) && (
                <div className="text-sm text-gray-600 mb-2">{event.venue || event.location}</div>
              )}
              
              <div className="text-sm text-gray-600">
                Hosted by: <span className="font-medium">{event.creator?.username || friendProfile?.username || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="flex items-center ml-4">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {event.attendee_count || 12}
              </div>
              <div className="ml-2 text-sm font-medium text-gray-700">+9</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
