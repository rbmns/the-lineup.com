import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { Card } from '@/components/ui/card';

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
    <Card 
      className="p-4 hover:bg-gray-50 hover:shadow-lg transition-all cursor-pointer rounded-xl shadow-md"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        {event.image_urls && event.image_urls.length > 0 && (
          <img
            src={event.image_urls[0]}
            alt={event.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {event.title}
          </h3>
          
          <div className="flex items-start text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-x-1">
              <span>
                {event.start_date && formatDate(event.start_date)}
              </span>
              {event.start_time && (
                <>
                  <span className="hidden sm:inline mx-1">•</span>
                  <span>{formatEventTime(event.start_time, event.end_time)}</span>
                </>
              )}
            </div>
          </div>
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          
          {event.attendees && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.attendees.going} attending</span>
            </div>
          )}
        </div>
        
        {event.rsvp_status && (
          <div className="flex-shrink-0">
            <span className={`px-2 py-1 text-xs rounded-full ${
              event.rsvp_status === 'Going' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {event.rsvp_status}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
