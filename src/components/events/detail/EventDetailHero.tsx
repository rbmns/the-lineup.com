
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
    <div className="w-full">
      {/* Image Section */}
      <div className="relative w-full h-56 sm:h-72 lg:h-80">
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
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Category as white text - top left */}
        {event.event_category && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
            <span className="text-white text-sm font-medium px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full">
              {event.event_category}
            </span>
          </div>
        )}
        
        {/* Share button - Top right */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <EventShareButton event={event} variant="outline" />
        </div>
        
        {/* Desktop: Event title overlay - hidden on mobile */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 hidden sm:block">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 sm:mb-2 text-left leading-tight">
            {event.title}
          </h1>
          <div className="flex items-center text-white/90 text-sm sm:text-base">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="font-medium">
              {event.start_date && formatDate(event.start_date)}
              {event.start_time && `, ${formatEventTime(event.start_time, event.end_time)}`}
            </span>
          </div>
          {/* Organizer info without gradient background */}
          {event.organiser_name && (
            <p className="text-white/80 text-sm sm:text-base mt-1 font-medium">
              By {event.organiser_name}
            </p>
          )}
        </div>
      </div>

      {/* Mobile: Content below image */}
      <div className="block sm:hidden px-4 py-4 bg-white">
        <h1 className="text-xl font-bold text-[#005F73] mb-2 leading-tight">
          {event.title}
        </h1>
        <div className="flex items-center text-[#005F73]/80 text-sm mb-2">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-[#2A9D8F]" />
          <span className="font-medium">
            {event.start_date && formatDate(event.start_date)}
            {event.start_time && `, ${formatEventTime(event.start_time, event.end_time)}`}
          </span>
        </div>
        {/* Organizer info without gradient background */}
        {event.organiser_name && (
          <p className="text-[#005F73]/70 text-sm font-medium">
            By <span className="text-[#2A9D8F]">{event.organiser_name}</span>
          </p>
        )}
      </div>
    </div>
  );
};
