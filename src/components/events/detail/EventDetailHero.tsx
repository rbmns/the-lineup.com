
import React from 'react';
import { Event } from '@/types';
import { Calendar } from 'lucide-react';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';
import { getEventImage } from '@/utils/eventImages';
import EventShareButton from '@/components/events/EventShareButton';

interface EventDetailHeroProps {
  event: Event;
}

export const EventDetailHero: React.FC<EventDetailHeroProps> = ({ event }) => {
  const eventImage = getEventImage(event);

  return (
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
      
      {/* Category pill on image - left side only */}
      {event.event_category && (
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <CategoryPill 
            category={event.event_category} 
            size="sm" 
            showIcon={true}
            className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-sm"
          />
        </div>
      )}

      {/* Event type as white text - right side */}
      {event.vibe && (
        <div className="absolute top-3 sm:top-4 right-12 sm:right-16">
          <span className="text-white text-sm font-medium px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full">
            {event.vibe}
          </span>
        </div>
      )}
      
      {/* Share button - Top right */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
        <EventShareButton event={event} variant="outline" />
      </div>
      
      {/* Event title overlay - Mobile optimized */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
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
  );
};
