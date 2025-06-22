
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
      {/* Larger image with category and vibe pills */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-100 flex-shrink-0">
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
          <div className="absolute top-4 left-4 z-10">
            <CategoryPill 
              category={event.event_category} 
              size="sm"
            />
          </div>
        )}

        {/* Event vibe pill - top right */}
        <div className="absolute top-4 right-4 z-10">
          <EventVibeLabel 
            vibe={event.vibe || 'general'} 
            size="sm"
          />
        </div>
      </div>
      
      {/* Content with more padding */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        {/* Title - larger */}
        <h3 className="font-bold text-primary text-xl leading-tight line-clamp-2">
          {event.title}
        </h3>
        
        {/* Organizer info */}
        {event.organiser_name && (
          <p className="text-base text-primary/70 font-medium">
            By {event.organiser_name}
          </p>
        )}
        
        {/* Date and Time - larger */}
        <div className="flex items-center gap-3 text-base text-primary/80">
          <Calendar className="h-5 w-5 text-primary/60 flex-shrink-0" />
          <span className="font-semibold">
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        {/* Location - larger */}
        <div className="flex items-center gap-3 text-base text-primary/80">
          <MapPin className="h-5 w-5 text-primary/60 flex-shrink-0" />
          <span className="truncate font-medium">
            {getVenueDisplay()}
          </span>
        </div>
      </div>
    </Card>
  );
};
