
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { Event } from '@/types';

interface FriendEventCardProps {
  event: Event & {
    friend_rsvp_status?: string;
    friend_user_id?: string;
    is_friend_creator?: boolean;
  };
  friendProfile?: {
    id: string;
    username: string;
    avatar_url?: string[];
  };
}

export const FriendEventCard: React.FC<FriendEventCardProps> = ({ event, friendProfile }) => {
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = (avatarUrl?: string[]) => {
    if (avatarUrl && Array.isArray(avatarUrl) && avatarUrl.length > 0) {
      return avatarUrl[0];
    }
    return null;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr?: string | null) => {
    if (!timeStr) return '';
    return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {event.image_urls && event.image_urls.length > 0 ? (
              <img 
                src={event.image_urls[0]} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-xs text-center">No Image</div>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
            {event.friend_rsvp_status && (
              <Badge variant={event.friend_rsvp_status === 'Going' ? 'default' : 'secondary'}>
                {event.friend_rsvp_status}
              </Badge>
            )}
            {event.is_friend_creator && (
              <Badge variant="outline">Creator</Badge>
            )}
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            {event.start_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(event.start_date)}</span>
                {event.start_time && (
                  <span>• {formatTime(event.start_time)}</span>
                )}
              </div>
            )}
            
            {event.venues && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.venues.name}, {event.venues.city}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{event.attendees?.going || 0} going • {event.attendees?.interested || 0} interested</span>
            </div>
          </div>
          
          {(friendProfile || event.creator) && (
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
              <Avatar className="h-6 w-6">
                <AvatarImage src={
                  friendProfile ? getAvatarUrl(friendProfile.avatar_url) || undefined 
                  : getAvatarUrl(event.creator?.avatar_url) || undefined
                } />
                <AvatarFallback className="text-xs">
                  {getInitials(friendProfile?.username || event.creator?.username || 'U')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">
                {event.is_friend_creator 
                  ? `Created by ${friendProfile?.username || event.creator?.username}`
                  : `${friendProfile?.username} is ${event.friend_rsvp_status?.toLowerCase()}`
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
