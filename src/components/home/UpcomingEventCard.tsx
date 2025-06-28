
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
        "bg-coconut border border-clay/20 rounded-md p-4 sm:p-6 cursor-pointer transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-coastal-hover hover:border-clay/30 w-full group",
        className
      )}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover filter-warm transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              target.src = "/img/default.jpg";
            }
          }}
        />
      </div>
      
      {/* Title */}
      <h3 className="font-display text-lg text-midnight mb-3 leading-tight font-semibold">
        {event.title}
      </h3>
      
      {/* Organizer info */}
      {event.organiser_name && (
        <p className="font-mono text-xs text-overcast mb-3 uppercase tracking-wide">
          By {event.organiser_name}
        </p>
      )}
      
      {/* Metadata */}
      <div className="font-mono text-xs text-overcast space-y-2 mb-4 uppercase tracking-wide">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3.5 w-3.5 text-clay" />
          <span>
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="h-3.5 w-3.5 text-clay" />
          <span>
            {getVenueDisplay()}
          </span>
        </div>
      </div>

      {/* Tags/Vibes and Category */}
      <div className="flex flex-wrap gap-2">
        {event.vibe && (
          <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-midnight/10 text-midnight uppercase tracking-wide border border-midnight/20">
            {event.vibe}
          </span>
        )}
        {event.event_category && (
          <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-ocean-deep/15 text-ocean-deep uppercase tracking-wide border border-ocean-deep/25">
            {event.event_category}
          </span>
        )}
      </div>
    </div>
  );
};
