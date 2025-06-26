
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { LineupImage } from '@/components/ui/lineup-image';
import { Card } from '@/components/ui/card';
import { getVibeColors } from '@/utils/vibeColors';

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

  // Get vibe colors for the pill
  const vibeColors = event.vibe ? getVibeColors(event.vibe) : null;

  return (
    <Card 
      className={cn(
        "flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg bg-coconut border border-overcast rounded-xl group",
        className
      )}
      onClick={handleClick}
    >
      {/* Image with category pill only */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-gray-100 flex-shrink-0">
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
        
        {/* Category pill - top left only */}
        {event.event_category && (
          <div className="absolute top-3 left-3 z-10">
            <CategoryPill 
              category={event.event_category} 
              size="sm"
              className="bg-seafoam text-midnight text-xs rounded-full border border-overcast"
            />
          </div>
        )}

        {/* Event vibe with proper colors - top right */}
        {event.vibe && vibeColors && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${vibeColors.bg} ${vibeColors.text} shadow-sm`}>
              {event.vibe}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Title */}
        <h3 className="font-display text-midnight text-lg leading-tight line-clamp-2">
          {event.title}
        </h3>
        
        {/* Organizer info */}
        {event.organiser_name && (
          <p className="font-mono text-overcast text-xs">
            By <span className="text-midnight">{event.organiser_name}</span>
          </p>
        )}
        
        {/* Date and Time */}
        <div className="flex items-center gap-2 font-mono text-overcast text-xs">
          <Calendar className="h-4 w-4 text-clay flex-shrink-0" />
          <span>
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 font-mono text-overcast text-xs">
          <MapPin className="h-4 w-4 text-clay flex-shrink-0" />
          <span className="truncate">
            {getVenueDisplay()}
          </span>
        </div>
      </div>
    </Card>
  );
};
