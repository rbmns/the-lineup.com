
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatEventCardDateTime } from '@/utils/date-formatting';

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
      className="card-base cursor-pointer group hover-lift"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        {event.image_urls && event.image_urls.length > 0 && (
          <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
            <img
              src={event.image_urls[0]}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-h4 text-graphite-grey truncate mb-2">
            {event.title}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center text-small text-graphite-grey/80">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-ocean-teal" />
              <span>{formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}</span>
            </div>
            
            {(event.venues?.name || event.location) && (
              <div className="flex items-center text-small text-graphite-grey/80">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-ocean-teal" />
                <span className="truncate">{event.venues?.name || event.location}</span>
              </div>
            )}
            
            {event.attendees && (
              <div className="flex items-center text-small text-graphite-grey/80">
                <Users className="h-4 w-4 mr-2 flex-shrink-0 text-ocean-teal" />
                <span>{event.attendees.going} attending</span>
              </div>
            )}
          </div>
        </div>
        
        {event.rsvp_status && (
          <div className="flex-shrink-0">
            <span className={`event-card-tag ${
              event.rsvp_status === 'Going' 
                ? 'bg-ocean-teal/20 text-ocean-teal' 
                : 'bg-sunrise-ochre/20 text-graphite-grey'
            }`}>
              {event.rsvp_status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
