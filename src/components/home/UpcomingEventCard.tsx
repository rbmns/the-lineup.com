
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { LineupImage } from '@/components/ui/lineup-image';
import { Card } from '@/components/ui/card';
import EventVibeLabel from '@/components/polymet/event-vibe-label';

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
    <Card 
      className={cn(
        "flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl bg-white border border-gray-200 rounded-xl group",
        className
      )}
      onClick={handleClick}
    >
      {/* Image with category and vibe pills */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="video"
          treatment="subtle-overlay"
          overlayVariant="ocean"
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              target.src = "/img/default.jpg";
            }
          }}
        />
        
        {/* Category pill - top left */}
        {event.event_category && (
          <div className="absolute top-3 left-3 z-10">
            <CategoryPill 
              category={event.event_category} 
              size="sm"
            />
          </div>
        )}

        {/* Event vibe pill - top right */}
        <div className="absolute top-3 right-3 z-10">
          <EventVibeLabel 
            vibe={event.vibe || 'general'} 
            size="sm"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-primary text-lg leading-tight line-clamp-2">
          {event.title}
        </h3>
        
        {/* Organizer info */}
        {event.organiser_name && (
          <p className="text-sm text-primary/70">
            By {event.organiser_name}
          </p>
        )}
        
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-primary/80">
          <Calendar className="h-4 w-4 text-primary/60 flex-shrink-0" />
          <span className="font-medium">
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-primary/80">
          <MapPin className="h-4 w-4 text-primary/60 flex-shrink-0" />
          <span className="truncate">
            {getVenueDisplay()}
          </span>
        </div>
      </div>
    </Card>
  );
};
