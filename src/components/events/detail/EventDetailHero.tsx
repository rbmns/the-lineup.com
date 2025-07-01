
import React from 'react';
import { Event } from '@/types';
import { Calendar } from 'lucide-react';
import { formatEventDate, formatEventTime } from '@/utils/timezone-utils';
import { getEventImage } from '@/utils/eventImages';
import EventShareButton from '@/components/events/EventShareButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface EventDetailHeroProps {
  event: Event;
}

export const EventDetailHero: React.FC<EventDetailHeroProps> = ({ event }) => {
  const eventImage = getEventImage(event);
  const isMobile = useIsMobile();
  const eventTimezone = event.timezone || 'Europe/Amsterdam';

  // Get the formatted date and time
  const getEventDateTimeDisplay = () => {
    // Use timestampz fields first
    if (event.start_datetime) {
      const eventDate = formatEventDate(event.start_datetime, eventTimezone);
      const startTime = formatEventTime(event.start_datetime, eventTimezone);
      const endTime = event.end_datetime ? formatEventTime(event.end_datetime, eventTimezone) : null;
      
      return {
        date: eventDate,
        time: endTime ? `${startTime}-${endTime}` : startTime
      };
    }
    
    // Fallback to legacy fields
    if (event.start_date) {
      const eventDate = formatEventDate(event.start_date, eventTimezone);
      let timeDisplay = '';
      
      if (event.start_time && event.end_time) {
        const startTime = formatEventTime(`${event.start_date}T${event.start_time}`, eventTimezone);
        const endTime = formatEventTime(`${event.start_date}T${event.end_time}`, eventTimezone);
        timeDisplay = `${startTime}-${endTime}`;
      } else if (event.start_time) {
        timeDisplay = formatEventTime(`${event.start_date}T${event.start_time}`, eventTimezone);
      }
      
      return {
        date: eventDate,
        time: timeDisplay
      };
    }
    
    return { date: '', time: '' };
  };

  const { date, time } = getEventDateTimeDisplay();

  return (
    <div className="relative w-full">
      {/* Large Event Image */}
      <div className={cn(
        "relative w-full overflow-hidden",
        isMobile ? "h-64" : "h-96 md:h-[500px]"
      )}>
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
        
        {/* Share button - top right */}
        <div className="absolute top-4 right-4 z-20">
          <EventShareButton 
            event={event} 
            variant="outline"
          />
        </div>
        
        {/* Desktop: Event Title and Key Metadata Overlay */}
        {!isMobile && (
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
                  {date && time && `${date}, ${time}`}
                  {date && !time && date}
                  {!date && 'Date and time TBD'}
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
        )}
      </div>

      {/* Mobile: Title and date below image */}
      {isMobile && (
        <div className="p-4 bg-pure-white">
          <h1 className="text-2xl font-bold text-graphite-grey mb-3 leading-tight">
            {event.title}
          </h1>
          
          <div className="space-y-2">
            {/* Date and Time */}
            <div className="flex items-center text-base text-graphite-grey">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-ocean-teal" />
              <span>
                {date && time && `${date}, ${time}`}
                {date && !time && date}
                {!date && 'Date and time TBD'}
              </span>
            </div>
            
            {/* Organizer */}
            {event.organiser_name && (
              <p className="text-sm text-graphite-grey/80">
                By {event.organiser_name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
