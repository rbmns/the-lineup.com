
import React from 'react';
import { Event } from '@/types';
import { Calendar } from 'lucide-react';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { getEventImage } from '@/utils/eventImages';
import EventShareButton from '@/components/events/EventShareButton';

interface EventDetailHeroProps {
  event: Event;
}

export const EventDetailHero: React.FC<EventDetailHeroProps> = ({ event }) => {
  const eventImage = getEventImage(event);

  return (
    <div className="relative w-full">
      {/* Large Event Image */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <img 
          src={eventImage} 
          alt={event.title} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('default.jpg')) {
              target.src = 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg';
            }
          }} 
        />
        
        {/* Subtle graphite-grey overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite-grey/60 via-graphite-grey/20 to-transparent" />
        
        {/* Category badge - top left */}
        {event.event_category && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center px-3 py-1 rounded-sm bg-pure-white/90 text-graphite-grey text-sm font-medium backdrop-blur-sm">
              {event.event_category}
            </span>
          </div>
        )}
        
        {/* Share button - top right */}
        <div className="absolute top-4 right-4 z-20">
          <EventShareButton 
            event={event} 
            variant="outline"
          />
        </div>
        
        {/* Event Title and Key Metadata Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Event Title */}
          <h1 className="text-h1 font-montserrat text-pure-white mb-4 leading-tight drop-shadow-lg">
            {event.title}
          </h1>
          
          {/* Key Metadata */}
          <div className="space-y-2">
            {/* Date and Time */}
            <div className="flex items-center text-large font-lato text-pure-white drop-shadow-md">
              <Calendar className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>
                {event.start_date && formatDate(event.start_date)}
                {event.start_time && `, ${formatEventTime(event.start_time, event.end_time)}`}
              </span>
            </div>
            
            {/* Organizer */}
            {event.organiser_name && (
              <p className="text-large font-lato text-pure-white/90 drop-shadow-md">
                By {event.organiser_name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
