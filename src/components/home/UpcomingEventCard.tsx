
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventImages } from '@/hooks/useEventImages';
import { formatEventCardDateTime } from '@/utils/date-formatting';

interface UpcomingEventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  className?: string;
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  event,
  onClick,
  className,
}) => {
  const { getEventImageUrl } = useEventImages();
  const imageUrl = getEventImageUrl(event);

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const getVenueDisplay = (): string => {
    if (event.venues?.name) {
      return event.venues.name;
    }
    
    if (event.location) {
      return event.location;
    }
    
    return 'Location TBD';
  };

  return (
    <div 
      className={cn(
        "bg-ivory border border-overcast rounded-sm p-4 sm:p-6 cursor-pointer transition-colors hover:bg-coconut w-full",
        className
      )}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="w-full h-48 mb-4 overflow-hidden rounded-sm">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover brightness-90 contrast-110 saturate-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              target.src = "/img/default.jpg";
            }
          }}
        />
      </div>
      
      {/* Title */}
      <h3 className="font-display text-lg text-midnight mb-3 leading-tight">
        {event.title}
      </h3>
      
      {/* Organizer info */}
      {event.organiser_name && (
        <p className="font-mono text-xs text-overcast mb-3">
          By {event.organiser_name}
        </p>
      )}
      
      {/* Metadata */}
      <div className="font-mono text-xs text-overcast space-y-1 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3" />
          <span>
            {getVenueDisplay()}
          </span>
        </div>
      </div>

      {/* Tags/Vibes and Category */}
      <div className="flex flex-wrap gap-2">
        {event.vibe && (
          <span className="bg-sage text-midnight text-xs font-mono px-2 py-0.5 rounded lowercase">
            {event.vibe}
          </span>
        )}
        {event.event_category && (
          <span className="bg-sage text-midnight text-xs font-mono px-2 py-0.5 rounded lowercase">
            {event.event_category}
          </span>
        )}
      </div>
    </div>
  );
};
