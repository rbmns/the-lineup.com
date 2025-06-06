
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatEventDate, formatEventTime } from '@/utils/date-formatting';

interface ProfileEventCardProps {
  event: Event;
}

export const ProfileEventCard: React.FC<ProfileEventCardProps> = ({ event }) => {
  const handleClick = () => {
    // Dispatch custom event to trigger global overlay
    const customEvent = new CustomEvent('eventCardClicked', {
      detail: { eventId: event.id }
    });
    window.dispatchEvent(customEvent);
  };

  return (
    <div 
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {event.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="mr-4">
              {formatEventDate(event.start_date)} at {formatEventTime(event.start_time)}
            </span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          
          {event.attendees_count !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.attendees_count} attending</span>
            </div>
          )}
        </div>
        
        {event.user_rsvp_status && (
          <div className="flex-shrink-0">
            <span className={`px-2 py-1 text-xs rounded-full ${
              event.user_rsvp_status === 'Going' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {event.user_rsvp_status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
