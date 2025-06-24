
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
    <div className="relative w-full h-64 sm:h-80 lg:h-96">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Category pill on image */}
      {event.event_category && (
        <div className="absolute top-4 left-4">
          <CategoryPill category={event.event_category} size="sm" showIcon={true} />
        </div>
      )}
      
      {/* Share button - Top right */}
      <div className="absolute top-4 right-4">
        <EventShareButton event={event} variant="outline" />
      </div>
      
      {/* Event title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 text-left">
          {event.title}
        </h1>
        <div className="flex items-center text-white/90 text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {event.start_date && formatDate(event.start_date)}
            {event.start_time && `, ${formatEventTime(event.start_time, event.end_time)}`}
          </span>
        </div>
      </div>
    </div>
  );
};
